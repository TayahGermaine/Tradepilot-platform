// The frontend's api.js does:
//   const errorBody = await res.json().catch(() => ({ message: res.statusText }))
//   throw new Error(errorBody.message || `Request failed: ${res.status}`)
// so every error response here must be JSON with a `message` field.

export function notFoundHandler(req, res) {
  res.status(404).json({ message: `No route for ${req.method} ${req.originalUrl}` })
}

export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  let status = err.status || 500
  let message = err.message || 'Internal server error'

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    status = 400
    message = Object.values(err.errors).map((e) => e.message).join(', ')
  }

  // Mongoose duplicate key error (e.g. email already registered)
  if (err.code === 11000) {
    status = 409
    const field = Object.keys(err.keyValue || {})[0] || 'field'
    message = `That ${field} is already in use`
  }

  // Malformed ObjectId in a route param
  if (err.name === 'CastError') {
    status = 400
    message = `Invalid ${err.path}`
  }

  if (status >= 500) {
    console.error(err)
  }

  res.status(status).json({ message })
}
