module.exports = async function resetGame ({
  gameId,
  gameRepository,
  gameService
}) {
  const gameData = await gameRepository.getGameDatas(gameId)
  const newGame = gameService.newGame()

  return gameRepository.resetGame({
    gameId,
    newGame,
    currentPlayer: gameData.blackPlayer
  })
}
