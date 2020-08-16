const { KnownUserError } = require('../models/errors')

module.exports = {
  async canUserRegisterByEmailOrPSeudo ({ email, pseudo }, userRepository) {
    const isUserknownByEmail = await userRepository.isUserknownByEmail(email)
    const isUserknownByPseudo = await userRepository.isUserknownByPseudo(pseudo)
    if (isUserknownByEmail) {
      throw new KnownUserError('email already registered')
    }
    if (isUserknownByPseudo) {
      throw new KnownUserError('pseudo already registered')
    }
    return true
  }
}
