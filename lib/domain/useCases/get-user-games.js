module.exports = async function getUserGames ({
  userId,
  gameRepository
}) {
  return gameRepository.getUserGames(userId)
}
