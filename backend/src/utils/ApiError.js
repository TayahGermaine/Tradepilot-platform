// Lightweight error class carrying an HTTP status code, thrown from
// controllers and rendered consistently by the error handler middleware.
export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
    this.name = 'ApiError'
  }
}
