class NotFound extends Error {
  constructor (message = 'Not found') {
    super(message)
    this.statusCode = 404
  }
}

module.exports = NotFound
