import User from '../models/User.js'
import Wallet from '../models/Wallet.js'
import Position from '../models/Position.js'
import BrokerRequest from '../models/BrokerRequest.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { money, tone } from '../utils/format.js'
import { priceOf } from '../utils/marketPrices.js'

async function clientSnapshot(clientUser) {
  const [wallet, positions] = await Promise.all([
    Wallet.findOne({ user: clientUser._id }),
    Position.find({ user: clientUser._id }),
  ])
  const equity = wallet ? [...wallet.balances.entries()].reduce((sum, [sym, amt]) => sum + amt * priceOf(sym), 0) : 0
  const pnl = positions.reduce((sum, p) => sum + (p.mark - p.entry) * p.size, 0)
  const marginBase = (wallet?.cashAvailable || 0) + (wallet?.collateralLocked || 0)
  const margin = marginBase > 0 ? Math.round(((wallet?.collateralLocked || 0) / marginBase) * 100) : 0
  const status = margin > 80 ? 'Margin call' : margin > 55 ? 'Watch' : 'Healthy'

  return { clientUser, wallet, positions, equity, pnl, margin, status }
}

// GET /api/broker/profile
export const getProfile = asyncHandler(async (req, res) => {
  res.json({
    ...req.user.toPublicJSON(),
    region: req.user.region || 'Unassigned',
  })
})

// GET /api/broker/stats
export const getStats = asyncHandler(async (req, res) => {
  const clients = await User.find({ role: 'client', brokerId: req.user._id })
  const snapshots = await Promise.all(clients.map(clientSnapshot))

  const bookEquity = snapshots.reduce((sum, s) => sum + s.equity, 0)
  const marginAlerts = snapshots.filter((s) => s.margin > 70).length

  res.json([
    { label: 'Clients under management', value: String(clients.length), delta: 'Live count', tone: 'up' },
    { label: 'Book equity', value: money(bookEquity), delta: 'Sum of client wallets', tone: 'up' },
    { label: 'Commission (MTD)', value: money(bookEquity * 0.0025), delta: 'Accrued, unpaid', tone: 'neutral' },
    { label: 'Margin alerts', value: String(marginAlerts), delta: marginAlerts > 0 ? `${marginAlerts} need review` : 'All clear', tone: marginAlerts > 0 ? 'down' : 'up' },
  ])
})

// GET /api/broker/clients
export const getClientBook = asyncHandler(async (req, res) => {
  const clients = await User.find({ role: 'client', brokerId: req.user._id })
  const snapshots = await Promise.all(clients.map(clientSnapshot))

  res.json(
    snapshots.map((s) => ({
      id: s.clientUser._id.toString(),
      name: s.clientUser.fullName,
      equity: money(s.equity),
      margin: s.margin,
      pnl: money(s.pnl, { sign: true }),
      pnlTone: tone(s.pnl),
      status: s.status,
    }))
  )
})

// GET /api/broker/clients/:clientId
export const getClientDetail = asyncHandler(async (req, res) => {
  const client = await User.findOne({ _id: req.params.clientId, role: 'client', brokerId: req.user._id })
  if (!client) throw new ApiError(404, 'Client not found')

  const s = await clientSnapshot(client)

  res.json({
    id: s.clientUser._id.toString(),
    name: s.clientUser.fullName,
    email: s.clientUser.email,
    equity: money(s.equity),
    margin: s.margin,
    pnl: money(s.pnl, { sign: true }),
    pnlTone: tone(s.pnl),
    status: s.status,
    positions: s.positions.map((p) => ({
      symbol: p.symbol,
      size: `${p.size} ${p.sizeUnit}`,
      entry: money(p.entry),
      mark: money(p.mark),
      pnl: money((p.mark - p.entry) * p.size, { sign: true }),
      status: p.status,
    })),
  })
})

// GET /api/broker/requests
export const getRequests = asyncHandler(async (req, res) => {
  const requests = await BrokerRequest.find({ broker: req.user._id, status: 'pending' })
    .populate('client', 'fullName')
    .sort({ createdAt: -1 })

  res.json(
    requests.map((r) => ({
      id: r.ref,
      client: r.client?.fullName || 'Unknown client',
      detail: r.detail,
    }))
  )
})

// PATCH /api/broker/requests/:requestId
// Body: { decision: 'approved' | 'declined' }
export const decideRequest = asyncHandler(async (req, res) => {
  const { decision } = req.body
  if (!['approved', 'declined'].includes(decision)) {
    throw new ApiError(400, 'decision must be approved or declined')
  }

  const request = await BrokerRequest.findOne({ ref: req.params.requestId, broker: req.user._id })
  if (!request) throw new ApiError(404, 'Request not found')

  request.status = decision
  request.decidedAt = new Date()
  await request.save()

  res.json({ id: request.ref, status: request.status })
})

// GET /api/broker/alerts
export const getMarginAlerts = asyncHandler(async (req, res) => {
  const clients = await User.find({ role: 'client', brokerId: req.user._id })
  const snapshots = await Promise.all(clients.map(clientSnapshot))

  res.json(
    snapshots
      .filter((s) => s.margin > 70)
      .map((s) => ({
        client: s.clientUser.fullName,
        margin: s.margin,
        status: s.status,
        equity: money(s.equity),
      }))
  )
})
