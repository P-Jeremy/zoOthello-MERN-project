const { NotFound } = require('../models/errors')

module.exports = async function signIn ({
  user,
  userRepository
}) {
  const isUserKnownByEmail = await userRepository.isUserknownByEmail(user.email)

  const isUserKnownByPseudo = await userRepository.isUserknownByPseudo(user.pseudo)

  if (!isUserKnownByPseudo || !isUserKnownByEmail) {
    throw new NotFound()
  }

  const registeredUser = await userRepository.signIn(user)
  return registeredUser
}
