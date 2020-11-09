const { NotFound } = require('../models/errors')

module.exports = async function deleteOneGame ({
  gameId,
  userId,
  gameRepository
}) {
  const userGames = await gameRepository.getUserGames(userId)

  const gameToDelete = userGames.find(game => String(game._id) === String(gameId))

  if (!gameToDelete) {
    throw new NotFound()
  }

  return gameRepository.deleteGame(gameToDelete._id)
}
