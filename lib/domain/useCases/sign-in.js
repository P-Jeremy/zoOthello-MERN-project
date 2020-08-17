const { NotFound } = require('../models/errors')

module.exports = async function signIn ({
  user,
  userRepository
}) {
  const isUserKnownByPseudo = await userRepository.isUserknownByPseudo(user.pseudo)

  if (!isUserKnownByPseudo) {
    throw new NotFound()
  }

  const storedUser = await userRepository.signIn(user)

  return storedUser
}
