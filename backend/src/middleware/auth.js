import { verifyToken } from '../utils/jwt.js'
import { ApiError } from '../utils/ApiError.js'
import User from '../models/User.js'
import { asyncHandler } from '../utils/asyncHandler.js'

// Verifies the Bearer token and attaches the full Mongo user doc to req.user.
export const requireAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || ''
  const [scheme, token] = header.split(' ')

  if (scheme !== 'Bearer' || !token) {
    throw new ApiError(401, 'Missing or malformed Authorization header')
  }

  let payload
  try {
    payload = verifyToken(token)
  } catch {
    throw new ApiError(401, 'Invalid or expired token')
  }

  const user = await User.findById(payload.sub)
  if (!user || user.status !== 'active') {
    throw new ApiError(401, 'Account not found or inactive')
  }

  req.user = user
  next()
})

// Restricts a route to one or more roles. Use after requireAuth.
export function requireRole(...roles) {
  return function roleGuard(req, res, next) {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have access to this resource'))
    }
    next()
  }
}
