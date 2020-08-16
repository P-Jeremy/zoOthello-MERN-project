module.exports = async function signIn ({
  user,
  userRepository,
  userService
}) {
  const isUserUnknown = await userService.isUserAlreadyKnownByEmailOrPseudo(user, userRepository)
  if (!isUserUnknown) {
    const registeredUser = await userRepository.signIn(user)
    return registeredUser
  }
}
