module.exports = async function getUserInfos ({
  userId,
  userRepository
}) {
  return await userRepository.getUserInfos({ _id: userId })
}
