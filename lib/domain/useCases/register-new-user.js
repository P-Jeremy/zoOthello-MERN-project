const { KnownUserError } = require('../models/errors')

module.exports = async function registerNewUser ({
  user,
  userRepository
}) {
  const isUserKnownByEmail = await userRepository.isUserknownByEmail({ email: user.email })
  if (isUserKnownByEmail) {
    throw new KnownUserError('email already registered')
  }
  const isUserKnownByPseudo = await userRepository.isUserknownByPseudo({ pseudo: user.pseudo })
  if (isUserKnownByPseudo) {
    throw new KnownUserError('pseudo already registered')
  }

  if (!isUserKnownByEmail && !isUserKnownByPseudo) {
    const hashedPassword = await user.hashedPassword

    const registeredUser = await userRepository.registerNewUSer({
      email: user.email,
      pseudo: user.pseudo,
      password: hashedPassword
    })

    return registeredUser
  }
}
