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

  if (!_isUserAllowedToPlay(gameData, currentPieceType, userId)) {
    socketio.sockets.emit('notAllowed', userId)
    throw new UnauthorizedError()
  }

  if (_doesUserHasBlackPawns(userId, gameData.blackPlayer)) {
    if (_hasAlreadyPassedOnce(blackPassCount)) {
      socketio.sockets.emit('gameUpdated', {
        origin: 'hasPassedTwice',
        player: user.pseudo,
        newMove: false,
        id: gameData._id
      })
      return gameRepository.resetGame(resetedGame)
    }
    blackPassCount = 1
  }

  if (_doesUserHasWhitePawns(userId, gameData.whitePlayer)) {
    if (_hasAlreadyPassedOnce(whitePassCount)) {
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
    _nextPieceType: _getOppositePieceType(currentPieceType)
  }

  const result = await gameRepository.updateGame({
    gameId,
    game: nexStateOfGame,
    whitePassCount,
    blackPassCount,
    currentPlayer: nextPlayer
  })

  socketio.sockets.emit('gameUpdated', {
    origin: 'pass',
    player: user.pseudo,
    newMove: false,
    id: result._id
  })

  return result
}

function _doesUserHasBlackPawns (userId, blackPlayerId) {
  return String(userId) === String(blackPlayerId)
}

function _doesUserHasWhitePawns (userId, whitePlayerId) {
  return String(userId) === String(whitePlayerId)
}

function _getOppositePieceType (type) {
  let newType
  if (type === 'WHITE') {
    newType = 'BLACK'
  }
  if (type === 'BLACK') {
    newType = 'WHITE'
  }

  return newType
}

function _hasAlreadyPassedOnce (count) {
  if (!count) {
    return false
  }
  return count >= 1
}

function _isUserAllowedToPlay ({ blackPlayer, whitePlayer }, currentPieceType, userId) {
  let isUserAllowed = false
  switch (currentPieceType) {
    case 'BLACK':
      if (_doesUserHasBlackPawns(userId, blackPlayer)) {
        isUserAllowed = true
      }
      break
    case 'WHITE':
      if (_doesUserHasWhitePawns(userId, whitePlayer)) {
        isUserAllowed = true
      }
      break
    default:
      isUserAllowed = false
  }
  return isUserAllowed
}
