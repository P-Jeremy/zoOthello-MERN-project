const KnowUserError = require('../models/errors')

module.exports = {
  async canUserRegisterByEmailOrPSeudo ({ email, pseudo }, userRepository) {
    const isUserknownByEmail = await userRepository.isUserknownByEmail(email)
    const isUserknownByPseudo = await userRepository.isUserknownByPseudo(pseudo)
    if (isUserknownByEmail) {
      throw new KnowUserError('email already registered')
    }
    if (isUserknownByPseudo) {
      throw new KnowUserError('pseudo already registered')
    }
    return true
  }
}
