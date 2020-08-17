const { KnownUserError } = require('../models/errors')

module.exports = async function registerNewUser ({
  user,
  userRepository
}) {
  const isUserKnownByEmail = await userRepository.isUserknownByEmail(user.email)
  if (isUserKnownByEmail) {
    throw new KnownUserError('email already registered')
  }
  const isUserKnownByPseudo = await userRepository.isUserknownByPseudo(user.pseudo)
  if (isUserKnownByPseudo) {
    throw new KnownUserError('pseudo already registered')
  }

  if (!isUserKnownByEmail && !isUserKnownByPseudo) {
    const registeredUser = await userRepository.registerNewUSer(user)
    return registeredUser
  }
}
