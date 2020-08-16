const { KnownUserError } = require('../models/errors')

module.exports = {
  async isUserAlreadyKnownByEmail ({ email }, userRepository) {
    const isUserknownByEmail = await userRepository.isUserknownByEmail(email)
    if (isUserknownByEmail) {
      throw new KnownUserError('email already registered')
    }
    return false
  },

  async isUserAlreadyKnownByPseudo ({ pseudo }, userRepository) {
    const isUserknownByPseudo = await userRepository.isUserknownByPseudo(pseudo)
    if (isUserknownByPseudo) {
      throw new KnownUserError('pseudo already registered')
    }
    return false
  }
}
