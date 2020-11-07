const { Game } = require('reversi')
const merge = require('lodash/merge')

module.exports = {
  getOppositePieceType (type) {
    let newType
    if (type === 'WHITE') {
      newType = 'BLACK'
    }
    if (type === 'BLACK') {
      newType = 'WHITE'
    }
    return newType
  },

  hasAlreadyPassedOnce (count) {
    if (!count) {
      return false
    }
    return count >= 1
  },

  isUserBlackPlayer (userId, blackPlayerId) {
    return _doesUserHasBlackPawns(userId, blackPlayerId)
  },

  isUserWhitePlayer (userId, whitePlayerId) {
    return _doesUserHasWhitePawns(userId, whitePlayerId)
  },

  isUserAllowedToPlay ({ blackPlayer, whitePlayer }, currentPieceType, userId) {
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
  },

  newGame () {
    return new Game()
  },

  convertGamefromDbIntoReversiGameInstance (game) {
    const reversiInstance = new Game()
    merge(reversiInstance, game)
    return reversiInstance
  }
}

function _doesUserHasBlackPawns (userId, blackPlayerId) {
  return String(userId) === String(blackPlayerId)
}

function _doesUserHasWhitePawns (userId, whitePlayerId) {
  return String(userId) === String(whitePlayerId)
}
