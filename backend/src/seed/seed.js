// Populates the database with an admin account plus a demo broker and client
// so the frontend has something real to render right after setup.
// Usage: npm run seed  (reads MONGODB_URI and SEED_* from .env)

import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB, disconnectDB } from '../config/db.js'
import User from '../models/User.js'
import Wallet from '../models/Wallet.js'
import Kyc from '../models/Kyc.js'
import Position from '../models/Position.js'
import Order from '../models/Order.js'
import Transaction from '../models/Transaction.js'
import Withdrawal from '../models/Withdrawal.js'
import BrokerRequest from '../models/BrokerRequest.js'

async function upsertUser({ fullName, email, password, role, brokerId = null, twoFA = false, region = '' }) {
  let user = await User.findOne({ email })
  if (!user) {
    user = new User({ fullName, email, role, brokerId, twoFA, region })
    await user.setPassword(password)
    await user.save()
    console.log(`[seed] created ${role}: ${email}`)
  } else {
    console.log(`[seed] ${role} already exists: ${email}`)
  }
  return user
}

async function ensureWallet(user, balances = {}, extra = {}) {
  let wallet = await Wallet.findOne({ user: user._id })
  if (!wallet) {
    wallet = await Wallet.create({
      user: user._id,
      balances: new Map(Object.entries(balances)),
      ...extra,
    })
  }
  return wallet
}

async function ensureKyc(user, overrides = {}) {
  const exists = await Kyc.findOne({ user: user._id })
  if (exists) return exists
  return Kyc.create({ user: user._id, fullName: user.fullName, ...overrides })
}

async function run() {
  await connectDB(process.env.MONGODB_URI)

  const adminEmail = (process.env.SEED_ADMIN_EMAIL || 'admin@tradepilot.io').toLowerCase()
  const admin = await upsertUser({
    fullName: process.env.SEED_ADMIN_NAME || 'System Administrator',
    email: adminEmail,
    password: process.env.SEED_ADMIN_PASSWORD || 'AdminSecure2026!',
    role: 'admin',
    twoFA: true,
  })
  await ensureWallet(admin)
  await ensureKyc(admin, { status: 'approved' })

  const broker = await upsertUser({
    fullName: 'Marcus Chen',
    email: 'marcus.chen@tradepilot.io',
    password: 'BrokerDemo2026!',
    role: 'broker',
    region: 'EMEA',
  })
  await ensureWallet(broker)
  await ensureKyc(broker, { status: 'approved' })

  const client = await upsertUser({
    fullName: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    password: 'ClientDemo2026!',
    role: 'client',
    brokerId: broker._id,
    twoFA: true,
  })
  const clientWallet = await ensureWallet(
    client,
    { USDT: 20080.15, BTC: 1.27, ETH: 8.94, SOL: 37.1 },
    { cashAvailable: 24190, collateralLocked: 52800, openTransfers: 2 }
  )
  await ensureKyc(client, { status: 'approved', submittedAt: new Date() })

  const secondClient = await upsertUser({
    fullName: 'Priya Nair',
    email: 'priya.nair@example.com',
    password: 'ClientDemo2026!',
    role: 'client',
    brokerId: broker._id,
  })
  await ensureWallet(secondClient, { USDT: 18450 }, { cashAvailable: 7000, collateralLocked: 11450 })
  await ensureKyc(secondClient, { status: 'pending', submittedAt: new Date(), idType: 'passport', idNumber: 'X12345678' })

  if ((await Position.countDocuments({ user: client._id })) === 0) {
    await Position.insertMany([
      { user: client._id, symbol: 'BTC/USDT', size: 0.55, sizeUnit: 'BTC', entry: 68900, mark: 69600, status: 'Hedged' },
      { user: client._id, symbol: 'ETH/USDT', size: 6.2, sizeUnit: 'ETH', entry: 3850, mark: 3920, status: 'Long' },
      { user: client._id, symbol: 'SOL/USDT', size: 27.4, sizeUnit: 'SOL', entry: 162, mark: 175, status: 'Long' },
      { user: client._id, symbol: 'LINK/USDT', size: 2800, sizeUnit: 'LINK', entry: 7.3, mark: 7.85, status: 'Scalp' },
    ])
    console.log('[seed] created demo positions')
  }

  if ((await Order.countDocuments({ user: client._id })) === 0) {
    await Order.insertMany([
      { user: client._id, pair: 'BTC/USDT', side: 'buy', type: 'limit', size: 0.1, price: 67500, status: 'open' },
      { user: client._id, pair: 'ETH/USDT', side: 'sell', type: 'limit', size: 2, price: 3950, status: 'open' },
    ])
    console.log('[seed] created demo orders')
  }

  if ((await Transaction.countDocuments({ user: client._id })) === 0) {
    await Transaction.insertMany([
      { user: client._id, action: 'Deposit', asset: 'USDT', amount: 5000, status: 'completed' },
      { user: client._id, action: 'Swap', asset: 'ETH', amount: 8200, status: 'completed' },
      { user: client._id, action: 'Withdrawal', asset: 'BTC', amount: -0.05, status: 'completed' },
    ])
    console.log('[seed] created demo transactions')
  }

  if ((await Withdrawal.countDocuments()) === 0) {
    await Withdrawal.insertMany([
      { ref: 'WD-4412', user: client._id, amount: 12400, asset: 'USDT', rail: 'Binance · BTC', risk: 'Medium', status: 'pending' },
      { ref: 'WD-4409', user: secondClient._id, amount: 3200, asset: 'USDT', rail: 'Bank · SEPA', risk: 'Low', status: 'pending' },
    ])
    console.log('[seed] created demo withdrawals')
  }

  if ((await BrokerRequest.countDocuments({ broker: broker._id })) === 0) {
    await BrokerRequest.insertMany([
      { ref: 'RQ-2201', broker: broker._id, client: secondClient._id, detail: 'Leverage increase to 10x on ETH/USDT' },
      { ref: 'RQ-2198', broker: broker._id, client: client._id, detail: 'Withdrawal release — $2,100 USDT' },
    ])
    console.log('[seed] created demo broker requests')
  }

  console.log('\n[seed] Done. Demo logins:')
  console.log(`  admin   ${adminEmail} / ${process.env.SEED_ADMIN_PASSWORD || 'AdminSecure2026!'}`)
  console.log('  broker  marcus.chen@tradepilot.io / BrokerDemo2026!')
  console.log('  client  alex.rivera@example.com / ClientDemo2026!')

  await disconnectDB()
  await mongoose.connection.close().catch(() => {})
}

run().catch((err) => {
  console.error('[seed] failed:', err)
  process.exit(1)
})
