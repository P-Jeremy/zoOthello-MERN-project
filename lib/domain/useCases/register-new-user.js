module.exports = async function registerNewUser ({
  user,
  userRepository,
  userService
}) {
  const isUserUnknown = await userService.canUserRegisterByEmailOrPSeudo(user, userRepository)
  if (isUserUnknown) {
    const registeredUser = await userRepository.registerNewUSer(user)
    return registeredUser
  }
}
