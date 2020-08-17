class KnownUserError extends Error {
  constructor (message) {
    super(message)
    this.statusCode = 409
  }
}

class UnauthorizedError extends Error {
  constructor (message = 'Unauthorized action') {
    super(message)
    this.statusCode = 403
  }
}

class NotFound extends Error {
  constructor (message = 'Not found') {
    super(message)
    this.statusCode = 404
  }
}

module.exports = { KnownUserError, NotFound, UnauthorizedError }
