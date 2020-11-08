const Game = require('../../db/models/Game')
const { NotFound } = require('../../domain/models/errors')

module.exports = {
  async getAllGames () {
    const fetchedGames = await Game.find()
    if (fetchedGames.length < 1) throw new NotFound()
    return fetchedGames
  },

  async getUserGames (userId) {
    const fetchedGames = await Game.find().or([{ blackPlayer: userId }, { whitePlayer: userId }])
    if (fetchedGames.length < 1) throw new NotFound()
    return fetchedGames
  },

  async getGameDatas (gameId) {
    const gameData = await Game.findById(gameId)
    if (gameData === null) {
      throw new NotFound()
    }
    return gameData
  },

  async updateGame ({
    gameId,
    game,
    whitePassCount,
    blackPassCount,
    currentPlayer,
    score
  }) {
    const gameData = await Game.findOneAndUpdate({ _id: gameId },
      { $set: { game, currentPlayer, blackPassCount, whitePassCount, score } },
      { new: true }
    )
    if (gameData === null) {
      throw new NotFound()
    }
    return gameData
  },

  async resetGame ({
    gameId,
    newGame,
    currentPlayer
  }) {
    const gameData = await Game.findOneAndUpdate({ _id: gameId },
      { $set: { game: newGame, whitePassCount: 0, blackPassCount: 0, currentPlayer, score: null } },
      { new: true }
    )
    if (gameData === null) {
      throw new NotFound()
    }
    return gameData
  }
}
