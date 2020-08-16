class KnownUserError extends Error {
  constructor (message) {
    super(message)
    this.statusCode = 409
  }
}

class NotFound extends Error {
  constructor (message = 'Not found') {
    super(message)
    this.statusCode = 404
  }
}

module.exports = { KnownUserError, NotFound }
