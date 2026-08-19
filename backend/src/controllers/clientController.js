import Wallet from '../models/Wallet.js'
import Position from '../models/Position.js'
import Order from '../models/Order.js'
import Transaction from '../models/Transaction.js'
import Withdrawal from '../models/Withdrawal.js'
import Kyc from '../models/Kyc.js'
import AiToolRun from '../models/AiToolRun.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { money, pct, tone, asset as assetStr, timeAgo } from '../utils/format.js'
import { priceOf } from '../utils/marketPrices.js'
import { getAiSignals, getClientAiTools, runTool } from '../utils/aiEngine.js'

// GET /api/client/profile
export const getProfile = asyncHandler(async (req, res) => {
  res.json(req.user.toPublicJSON())
})

// GET /api/client/portfolio
export const getPortfolio = asyncHandler(async (req, res) => {
  const [positions, wallet] = await Promise.all([
    Position.find({ user: req.user._id }),
    Wallet.findOne({ user: req.user._id }),
  ])

  const unrealizedPnl = positions.reduce((sum, p) => sum + (p.mark - p.entry) * p.size, 0)
  const holdingsValue = wallet
    ? [...wallet.balances.entries()].reduce((sum, [sym, amt]) => sum + amt * priceOf(sym), 0)
    : 0
  const nav = holdingsValue + unrealizedPnl
  const marginBase = (wallet?.cashAvailable || 0) + (wallet?.collateralLocked || 0)
  const marginUsage = marginBase > 0 ? ((wallet?.collateralLocked || 0) / marginBase) * 100 : 0

  res.json([
    { label: 'Current NAV', value: money(nav), delta: '24h change', tone: tone(unrealizedPnl) },
    { label: 'Unrealized PnL', value: money(unrealizedPnl, { sign: true }), delta: 'Net exposure', tone: tone(unrealizedPnl) },
    { label: 'Open positions', value: String(positions.length), delta: 'Live', tone: 'neutral' },
    { label: 'Margin usage', value: `${marginUsage.toFixed(0)}%`, delta: marginUsage > 70 ? 'Elevated' : 'Within limit', tone: marginUsage > 70 ? 'down' : 'neutral' },
  ])
})

// GET /api/client/positions
export const getPositions = asyncHandler(async (req, res) => {
  const positions = await Position.find({ user: req.user._id }).sort({ createdAt: -1 })
  res.json(
    positions.map((p) => {
      const pnl = (p.mark - p.entry) * p.size
      return {
        id: p._id.toString(),
        symbol: p.symbol,
        size: `${p.size} ${p.sizeUnit}`,
        entry: money(p.entry),
        mark: money(p.mark),
        pnl: money(pnl, { sign: true }),
        pnlTone: tone(pnl),
        status: p.status,
      }
    })
  )
})

// GET /api/client/wallet
export const getWallet = asyncHandler(async (req, res) => {
  const wallet = await Wallet.findOne({ user: req.user._id })
  if (!wallet) throw new ApiError(404, 'Wallet not found')

  const totalValue = [...wallet.balances.entries()].reduce((sum, [sym, amt]) => sum + amt * priceOf(sym), 0)

  res.json([
    { label: 'Total wallet balance', value: money(totalValue), delta: 'Live valuation', tone: 'up' },
    { label: 'Available cash', value: money(wallet.cashAvailable), delta: 'Ready to trade', tone: 'neutral' },
    { label: 'Collateral locked', value: money(wallet.collateralLocked), delta: 'Margin positions', tone: 'down' },
    { label: 'Open transfers', value: String(wallet.openTransfers), delta: 'Pending settlement', tone: 'neutral' },
  ])
})

// GET /api/client/holdings
export const getHoldings = asyncHandler(async (req, res) => {
  const wallet = await Wallet.findOne({ user: req.user._id })
  if (!wallet) throw new ApiError(404, 'Wallet not found')

  const rows = [...wallet.balances.entries()]
    .map(([sym, amt]) => ({ sym, amt, value: amt * priceOf(sym) }))
    .filter((r) => r.amt > 0)
  const total = rows.reduce((sum, r) => sum + r.value, 0) || 1

  const holdings = rows
    .sort((a, b) => b.value - a.value)
    .map((r) => ({
      asset: r.sym,
      amount: assetStr(r.amt, r.sym),
      value: money(r.value),
      allocation: Math.round((r.value / total) * 100),
      status: 'Active',
    }))

  res.json(holdings)
})

// GET /api/client/transactions
export const getTransactions = asyncHandler(async (req, res) => {
  const txs = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(25)
  res.json(
    txs.map((t) => ({
      id: t._id.toString(),
      action: t.action,
      asset: t.asset,
      amount: t.action === 'Deposit' || t.action === 'Withdrawal' ? assetStr(Math.abs(t.amount), t.asset) : money(Math.abs(t.amount)),
      status: t.status,
      when: `Updated ${timeAgo(t.updatedAt)}`,
    }))
  )
})

// GET /api/client/orders
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
  res.json(
    orders.map((o) => ({
      id: o._id.toString(),
      pair: o.pair,
      side: o.side,
      type: o.type,
      size: o.size,
      price: o.price,
      status: o.status,
      createdAt: o.createdAt,
    }))
  )
})

// POST /api/client/orders
// Body: { pair, side, type, size, price }
export const placeOrder = asyncHandler(async (req, res) => {
  const { pair, side, type = 'limit', size, price } = req.body

  if (!pair || !side || !size) {
    throw new ApiError(400, 'pair, side and size are required')
  }
  if (!['buy', 'sell'].includes(side)) {
    throw new ApiError(400, 'side must be buy or sell')
  }
  if (!['limit', 'market', 'stop'].includes(type)) {
    throw new ApiError(400, 'type must be limit, market or stop')
  }
  if (type !== 'market' && !price) {
    throw new ApiError(400, 'price is required for limit and stop orders')
  }

  const order = await Order.create({
    user: req.user._id,
    pair,
    side,
    type,
    size: Number(size),
    price: type === 'market' ? null : Number(price),
    status: type === 'market' ? 'filled' : 'open',
    filledAt: type === 'market' ? new Date() : null,
  })

  res.status(201).json({
    id: order._id.toString(),
    pair: order.pair,
    side: order.side,
    type: order.type,
    size: order.size,
    price: order.price,
    status: order.status,
    createdAt: order.createdAt,
  })
})

// DELETE /api/client/orders/:orderId
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.orderId, user: req.user._id })
  if (!order) throw new ApiError(404, 'Order not found')
  if (order.status !== 'open') throw new ApiError(400, `Cannot cancel an order with status "${order.status}"`)

  order.status = 'cancelled'
  order.cancelledAt = new Date()
  await order.save()

  res.json({ id: order._id.toString(), status: order.status })
})

// POST /api/client/wallet/deposit
// Body: { asset, amount }
export const requestDeposit = asyncHandler(async (req, res) => {
  const { asset, amount } = req.body
  const amt = Number(amount)
  if (!asset || !amt || amt <= 0) throw new ApiError(400, 'asset and a positive amount are required')

  const wallet = await Wallet.findOne({ user: req.user._id })
  if (!wallet) throw new ApiError(404, 'Wallet not found')

  const sym = asset.toUpperCase()
  wallet.balances.set(sym, (wallet.balances.get(sym) || 0) + amt)
  if (sym === 'USDT') wallet.cashAvailable += amt
  await wallet.save()

  const tx = await Transaction.create({
    user: req.user._id,
    action: 'Deposit',
    asset: sym,
    amount: amt,
    status: 'completed',
  })

  res.status(201).json({ id: tx._id.toString(), status: tx.status, asset: sym, amount: amt })
})

// POST /api/client/wallet/withdraw
// Body: { asset, amount, address }
export const requestWithdrawal = asyncHandler(async (req, res) => {
  const { asset, amount, address } = req.body
  const amt = Number(amount)
  if (!asset || !amt || amt <= 0) throw new ApiError(400, 'asset and a positive amount are required')

  const wallet = await Wallet.findOne({ user: req.user._id })
  if (!wallet) throw new ApiError(404, 'Wallet not found')

  const sym = asset.toUpperCase()
  const balance = wallet.balances.get(sym) || 0
  if (balance < amt) throw new ApiError(400, `Insufficient ${sym} balance`)

  wallet.balances.set(sym, balance - amt)
  wallet.openTransfers += 1
  await wallet.save()

  const usdValue = amt * priceOf(sym)
  const risk = usdValue > 10000 ? 'High' : usdValue > 2000 ? 'Medium' : 'Low'

  const tx = await Transaction.create({
    user: req.user._id,
    action: 'Withdrawal',
    asset: sym,
    amount: -amt,
    status: 'pending',
  })

  const ref = `WD-${Math.floor(1000 + Math.random() * 9000)}`
  const withdrawal = await Withdrawal.create({
    ref,
    user: req.user._id,
    amount: amt,
    asset: sym,
    rail: `Wallet · ${sym}`,
    address: address || '',
    risk,
    status: 'pending',
  })

  res.status(201).json({ id: tx._id.toString(), ref: withdrawal.ref, status: withdrawal.status, risk })
})

// GET /api/client/ai/signals
export const getClientAiSignals = asyncHandler(async (req, res) => {
  res.json(getAiSignals())
})

// GET /api/client/ai/tools
export const getClientTools = asyncHandler(async (req, res) => {
  res.json(getClientAiTools())
})

// POST /api/client/ai/run
export const runClientAiTool = asyncHandler(async (req, res) => {
  const { tool } = req.body
  if (!tool) throw new ApiError(400, 'tool is required')

  const result = runTool(tool)
  await AiToolRun.create({ user: req.user._id, tool, result: result.result })

  res.json(result)
})

// GET /api/client/kyc
export const getKycStatus = asyncHandler(async (req, res) => {
  const kyc = await Kyc.findOne({ user: req.user._id })
  if (!kyc) return res.json({ status: 'not_started' })

  res.json({
    status: kyc.status,
    fullName: kyc.fullName,
    dob: kyc.dob,
    nationality: kyc.nationality,
    address: kyc.address,
    idType: kyc.idType,
    idNumber: kyc.idNumber,
    docUploaded: kyc.docUploaded,
    selfieUploaded: kyc.selfieUploaded,
    submittedAt: kyc.submittedAt,
  })
})

// POST /api/client/kyc
// Body: { fullName, dob, nationality, address, idType, idNumber, docUploaded, selfieUploaded }
export const submitKyc = asyncHandler(async (req, res) => {
  const { fullName, dob, nationality, address, idType, idNumber, docUploaded, selfieUploaded } = req.body

  const kyc = await Kyc.findOneAndUpdate(
    { user: req.user._id },
    {
      user: req.user._id,
      fullName,
      dob,
      nationality,
      address,
      idType,
      idNumber,
      docUploaded: !!docUploaded,
      selfieUploaded: !!selfieUploaded,
      status: 'pending',
      submittedAt: new Date(),
    },
    { upsert: true, new: true }
  )

  res.status(201).json({ status: kyc.status, submittedAt: kyc.submittedAt })
})
