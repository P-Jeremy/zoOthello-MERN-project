const Game = require('../../db/models/Game')

module.exports = async function createGame ({
  gameRepository,
  userRepository,
  gameService,
  blackPlayer,
  whitePlayer
}) {
  const newGameBoard = gameService.newGame()
  const isBlackPlayerKnown = await userRepository.getUserInfos({ _id: blackPlayer })
  const isWhitePlayerKnown = await userRepository.getUserInfos({ _id: whitePlayer })

  if (isBlackPlayerKnown && isWhitePlayerKnown) {
    const gameData = new Game({
      game: newGameBoard,
      blackPlayer,
      whitePlayer,
      currentPlayer: blackPlayer
    })

    return gameRepository.addGame(gameData)
  }
}
