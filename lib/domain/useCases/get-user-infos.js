module.exports = async function getUserInfos ({
  userId,
  userRepository
}) {
  const registeredUser = await userRepository.getUserInfos(userId)
  return registeredUser
}
