module.exports = async function getAllGames ({
  gameRepository
}) {
  return gameRepository.getAllGames()
}
