class KnownUserError extends Error {
  constructor (message) {
    super(message)
    this.message = message
  }
}

class UnauthorizedError extends Error {
  constructor (message = 'Unauthorized action') {
    super(message)
    this.message = message
  }
}

class NotFound extends Error {
  constructor (message = 'Not found') {
    super(message)
    this.statusCode = 404
  }
}

module.exports = { KnownUserError, NotFound, UnauthorizedError }
