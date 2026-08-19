import User from '../models/User.js'
import Wallet from '../models/Wallet.js'
import Kyc from '../models/Kyc.js'
import { signToken } from '../utils/jwt.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

// POST /api/auth/register
// Body: { fullName, email, password, role } — role is 'client' or 'broker'.
// (Matches authApi.register in the frontend, which already blocks 'admin' client-side.)
export const register = asyncHandler(async (req, res) => {
  const { fullName, email, password, role } = req.body

  if (!fullName || !email || !password) {
    throw new ApiError(400, 'fullName, email and password are required')
  }
  if (password.length < 8) {
    throw new ApiError(400, 'Password must be at least 8 characters')
  }
  if (role === 'admin') {
    throw new ApiError(403, 'Admin accounts cannot be created through signup')
  }

  const existing = await User.findOne({ email: email.toLowerCase() })
  if (existing) {
    throw new ApiError(409, 'An account with that email already exists')
  }

  const user = new User({
    fullName,
    email: email.toLowerCase(),
    role: role === 'broker' ? 'broker' : 'client',
  })
  await user.setPassword(password)
  await user.save()

  await Wallet.create({ user: user._id })
  await Kyc.create({ user: user._id, fullName })

  const token = signToken({ sub: user._id.toString(), role: user.role })

  res.status(201).json({ token, user: user.toPublicJSON() })
})

// POST /api/auth/login
// Body: { email, password, role }
export const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body

  if (!email || !password) {
    throw new ApiError(400, 'email and password are required')
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash')
  if (!user || (role && user.role !== role)) {
    throw new ApiError(401, 'Invalid credentials')
  }

  const valid = await user.comparePassword(password)
  if (!valid) {
    throw new ApiError(401, 'Invalid credentials')
  }
  if (user.status !== 'active') {
    throw new ApiError(403, 'This account has been suspended')
  }

  const token = signToken({ sub: user._id.toString(), role: user.role })

  res.json({ token, user: user.toPublicJSON() })
})

// GET /api/auth/me — not called by the current frontend, but useful for
// validating a stored token / refreshing user data on app load.
export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toPublicJSON() })
})
