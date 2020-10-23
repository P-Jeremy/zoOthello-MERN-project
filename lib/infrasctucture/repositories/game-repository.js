const Game = require('../../db/models/Game')
const { NotFound } = require('../../domain/models/errors')

module.exports = {
  async getAllGames () {
    const fetchedGames = await Game.find()
    if (fetchedGames.length < 1) throw new NotFound()
    return fetchedGames
  }
}
