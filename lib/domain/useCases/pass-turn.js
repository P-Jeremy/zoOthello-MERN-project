const { UnauthorizedError } = require('../models/errors')

module.exports = async function passTurn ({
  gameId,
  gameRepository,
  gameService,
  socketio,
  userId,
  userRepository
}) {
  const gameData = await gameRepository.getGameDatas(gameId)
  const user = await userRepository.getUserInfos({ _id: userId })

  let blackPassCount = gameData.blackPassCount
  let whitePassCount = gameData.whitePassCount

  const currentPieceType = gameData.game._nextPieceType
  const nextPlayer = gameData.currentPlayer === gameData.blackPlayer ? gameData.whitePlayer : gameData.blackPlayer

  const resetedGame = {
    gameId,
    newGame: gameService.newGame(),
    currentPlayer: gameData.blackPlayer
  }

  if (!gameService.isUserAllowedToPlay(gameData, currentPieceType, userId)) {
    socketio.sockets.emit('notAllowed', userId)
    throw new UnauthorizedError()
  }

  if (gameService.isUserBlackPlayer(userId, gameData.blackPlayer)) {
    if (gameService.hasAlreadyPassedOnce(blackPassCount)) {
      const result = await gameRepository.resetGame(resetedGame)
      socketio.sockets.emit('gameUpdated', {
        origin: 'hasPassedTwice',
        player: user.pseudo,
        newMove: false,
        id: gameData._id
      })
      return result
    }
    blackPassCount = 1
  }

  if (gameService.isUserWhitePlayer(userId, gameData.whitePlayer)) {
    if (gameService.hasAlreadyPassedOnce(whitePassCount)) {
      socketio.sockets.emit('gameUpdated', {
        origin: 'hasPassedTwice',
        player: user.pseudo,
        newMove: false,
        id: gameData._id
      })
      return gameRepository.resetGame(resetedGame)
    }
    whitePassCount = 1
  }

  const nexStateOfGame = {
    ...gameData.game,
    _nextPieceType: gameService.getOppositePieceType(currentPieceType)
  }

  const result = await gameRepository.updateGame({
    gameId,
    game: nexStateOfGame,
    whitePassCount,
    blackPassCount,
    currentPlayer: nextPlayer,
    score: gameData.score
  })

  socketio.sockets.emit('gameUpdated', {
    origin: 'pass',
    player: user.pseudo,
    newMove: false,
    id: result._id
  })

  return result
}
