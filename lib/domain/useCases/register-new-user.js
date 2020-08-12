module.exports = async function registerNewUser ({
  user,
  userRepository
}) {
  const isUserAlreadyKnown = await userRepository.isUserAlreadyKnown(user)
  if (isUserAlreadyKnown) {
    return isUserAlreadyKnown
  }

  const registeredUser = await userRepository.registerNewUSer(user)

  return registeredUser
}
