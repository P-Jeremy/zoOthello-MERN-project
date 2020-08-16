
module.exports = async function registerNewUser ({
  user,
  userRepository,
  userService
}) {
  const isUserKnownByEmail = await userService.isUserAlreadyKnownByEmail(user, userRepository)
  const isUserKnownByPseudo = await userService.isUserAlreadyKnownByPseudo(user, userRepository)

  if (!isUserKnownByEmail && !isUserKnownByPseudo) {
    const registeredUser = await userRepository.registerNewUSer(user)
    return registeredUser
  }
}
