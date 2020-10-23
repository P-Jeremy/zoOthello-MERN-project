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
    const gameData = await Game.findOne({ _id: gameId })
    if (gameData.length < 1) throw new NotFound()
    return gameData
  }
}
