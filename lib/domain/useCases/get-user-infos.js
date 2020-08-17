module.exports = async function getUserInfos ({
  userId,
  userRepository
}) {
  const registeredUser = await userRepository.getUserInfos({ _id: userId })
  return registeredUser
}
