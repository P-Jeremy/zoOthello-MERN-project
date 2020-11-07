const { UnauthorizedError } = require('../models/errors')

module.exports = async function makeAMove ({
  gameId,
  userId,
  coordinates,
  gameRepository,
  gameService,
  socketio,
  userRepository
}) {
  const gameData = await gameRepository.getGameDatas(gameId)
  const user = await userRepository.getUserInfos({ _id: userId })
  const currentPieceType = gameData.game._nextPieceType
  const game = gameData.game

  if (!gameService.isUserAllowedToPlay(gameData, currentPieceType, userId)) {
    socketio.sockets.emit('notAllowed', userId)
    throw new UnauthorizedError()
  }

  const gameReversiInstance = gameService.convertGamefromDbIntoReversiGameInstance(game)

  const gameReport = gameReversiInstance.proceed(coordinates.x, coordinates.y)

  if (!gameReport.isSuccess) {
    throw new UnauthorizedError()
  }

  const nextPlayer = String(gameData.currentPlayer) === String(gameData.blackPlayer)
    ? gameData.whitePlayer
    : gameData.blackPlayer

  const result = await gameRepository.updateGame({
    gameId,
    blackPassCount: gameData.blackPassCount,
    whitePassCount: gameData.whitePassCount,
    game: gameReversiInstance,
    currentPlayer: nextPlayer
  })

  const payload = {
    origin: 'move',
    player: user.pseudo,
    newMove: true,
    id: gameData._id
  }

  socketio.sockets.emit('gameUpdated', payload)

  return result
}
