module.exports = async function registerNewUser ({
  user,
  userRepository
}) {
  const isUserUnknown = await userRepository.isUserUnknown(user)
  if (isUserUnknown) {
    const registeredUser = await userRepository.registerNewUSer(user)
    return registeredUser
  }
}
