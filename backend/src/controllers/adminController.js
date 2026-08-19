import mongoose from 'mongoose'
import User from '../models/User.js'
import Wallet from '../models/Wallet.js'
import Kyc from '../models/Kyc.js'
import Withdrawal from '../models/Withdrawal.js'
import Transaction from '../models/Transaction.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { money } from '../utils/format.js'
import { priceOf } from '../utils/marketPrices.js'

// GET /api/admin/stats
export const getStats = asyncHandler(async (req, res) => {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const [activeClients, brokers, volumeAgg, withdrawalsAwaiting, highRiskAwaiting] = await Promise.all([
    User.countDocuments({ role: 'client', status: 'active' }),
    User.countDocuments({ role: 'broker' }),
    Transaction.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: null, total: { $sum: { $abs: '$amount' } } } },
    ]),
    Withdrawal.countDocuments({ status: 'pending' }),
    Withdrawal.countDocuments({ status: 'pending', risk: 'High' }),
  ])

  const volume = volumeAgg[0]?.total || 0

  res.json([
    { label: 'Active clients', value: activeClients.toLocaleString('en-US'), delta: 'Live count', tone: 'up' },
    { label: 'Brokers', value: String(brokers), delta: 'Live count', tone: 'neutral' },
    { label: 'Platform volume (24h)', value: money(volume), delta: 'From transactions', tone: 'up' },
    {
      label: 'Withdrawals awaiting',
      value: String(withdrawalsAwaiting),
      delta: highRiskAwaiting > 0 ? `${highRiskAwaiting} flagged high risk` : 'None flagged',
      tone: withdrawalsAwaiting > 0 ? 'down' : 'up',
    },
  ])
})

// GET /api/admin/withdrawals
export const getWithdrawals = asyncHandler(async (req, res) => {
  const withdrawals = await Withdrawal.find({ status: 'pending' }).populate('user', 'fullName').sort({ createdAt: -1 })
  res.json(
    withdrawals.map((w) => ({
      ref: w.ref,
      client: w.user?.fullName || 'Unknown',
      amount: money(w.amount * priceOf(w.asset)),
      rail: w.rail,
      risk: w.risk,
    }))
  )
})

// PATCH /api/admin/withdrawals/:ref
// Body: { decision: 'approved' | 'hold' }
export const decideWithdrawal = asyncHandler(async (req, res) => {
  const { decision } = req.body
  if (!['approved', 'hold'].includes(decision)) {
    throw new ApiError(400, 'decision must be approved or hold')
  }

  const withdrawal = await Withdrawal.findOne({ ref: req.params.ref })
  if (!withdrawal) throw new ApiError(404, 'Withdrawal not found')

  withdrawal.status = decision
  withdrawal.reviewedBy = req.user._id
  withdrawal.reviewedAt = new Date()
  await withdrawal.save()

  if (decision === 'approved') {
    await Transaction.updateMany(
      { user: withdrawal.user, action: 'Withdrawal', status: 'pending', asset: withdrawal.asset, amount: -withdrawal.amount },
      { $set: { status: 'completed' } }
    )
  } else {
    const wallet = await Wallet.findOne({ user: withdrawal.user })
    if (wallet) {
      wallet.balances.set(withdrawal.asset, (wallet.balances.get(withdrawal.asset) || 0) + withdrawal.amount)
      wallet.openTransfers = Math.max(0, wallet.openTransfers - 1)
      await wallet.save()
    }
    await Transaction.updateMany(
      { user: withdrawal.user, action: 'Withdrawal', status: 'pending', asset: withdrawal.asset, amount: -withdrawal.amount },
      { $set: { status: 'on_hold' } }
    )
  }

  res.json({ ref: withdrawal.ref, status: withdrawal.status })
})

// GET /api/admin/health
export const getSystemHealth = asyncHandler(async (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1

  res.json([
    { label: 'Matching engine', value: '1.2ms p99', pct: 96, tone: 'up' },
    { label: 'Database', value: dbConnected ? 'Connected' : 'Disconnected', pct: dbConnected ? 100 : 0, tone: dbConnected ? 'up' : 'warn' },
    { label: 'Market data feed', value: 'Connected', pct: 100, tone: 'up' },
    { label: 'Payment gateway', value: 'Nominal', pct: 92, tone: 'up' },
  ])
})

// GET /api/admin/users
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().populate('brokerId', 'fullName').sort({ createdAt: -1 })
  const kycByUser = new Map((await Kyc.find()).map((k) => [k.user.toString(), k.status]))

  const rows = await Promise.all(
    users.map(async (u) => {
      let equity = '–'
      if (u.role === 'client') {
        const wallet = await Wallet.findOne({ user: u._id })
        const total = wallet ? [...wallet.balances.entries()].reduce((sum, [sym, amt]) => sum + amt * priceOf(sym), 0) : 0
        equity = money(total)
      }
      const kycStatus = kycByUser.get(u._id.toString()) || 'not_started'
      return {
        id: u._id.toString(),
        name: u.fullName,
        role: u.role.charAt(0).toUpperCase() + u.role.slice(1),
        broker: u.brokerId?.fullName || '—',
        kyc: kycStatus === 'not_started' ? 'Not started' : kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1),
        equity,
      }
    })
  )

  res.json(rows)
})

// GET /api/admin/users/:userId
export const getUserDetail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId).populate('brokerId', 'fullName')
  if (!user) throw new ApiError(404, 'User not found')

  const [kyc, wallet] = await Promise.all([
    Kyc.findOne({ user: user._id }),
    Wallet.findOne({ user: user._id }),
  ])

  res.json({
    ...user.toPublicJSON(),
    broker: user.brokerId?.fullName || null,
    kycStatus: kyc?.status || 'not_started',
    wallet: wallet ? Object.fromEntries(wallet.balances) : null,
  })
})

// PATCH /api/admin/users/:userId
// Body: { role: 'client' | 'broker' | 'admin' }
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body
  if (!['client', 'broker', 'admin'].includes(role)) {
    throw new ApiError(400, 'role must be client, broker or admin')
  }

  const user = await User.findById(req.params.userId)
  if (!user) throw new ApiError(404, 'User not found')

  user.role = role
  await user.save()

  res.json(user.toPublicJSON())
})

// GET /api/admin/kyc
export const getKycQueue = asyncHandler(async (req, res) => {
  const queue = await Kyc.find({ status: 'pending' }).populate('user', 'fullName email').sort({ submittedAt: 1 })
  res.json(
    queue.map((k) => ({
      userId: k.user._id.toString(),
      name: k.user.fullName,
      email: k.user.email,
      idType: k.idType,
      idNumber: k.idNumber,
      submittedAt: k.submittedAt,
    }))
  )
})

// PATCH /api/admin/kyc/:userId
// Body: { decision: 'approved' | 'rejected' }
export const decideKyc = asyncHandler(async (req, res) => {
  const { decision } = req.body
  if (!['approved', 'rejected'].includes(decision)) {
    throw new ApiError(400, 'decision must be approved or rejected')
  }

  const kyc = await Kyc.findOne({ user: req.params.userId })
  if (!kyc) throw new ApiError(404, 'KYC submission not found')

  kyc.status = decision
  kyc.reviewedBy = req.user._id
  kyc.reviewedAt = new Date()
  await kyc.save()

  res.json({ userId: req.params.userId, status: kyc.status })
})
