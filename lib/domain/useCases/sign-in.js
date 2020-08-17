const { NotFound } = require('../models/errors')

module.exports = async function signIn ({
  user,
  userRepository
}) {
  const isUserKnownByPseudo = await userRepository.isUserknownByPseudo(user.pseudo)

  const storedUser = await userRepository.getUserInfos({ pseudo: user.pseudo })

  const isUserAllowed = await _isPasswordCorrect(user, storedUser.payload.password)

  if (!isUserAllowed) {
    throw new NotFound()
  }

  if (!isUserKnownByPseudo) {
    throw new NotFound()
  }

  return storedUser
}

async function _isPasswordCorrect (user, storedPassword) {
  return await user.isPasswordMatchingStoredHash(storedPassword)
}
