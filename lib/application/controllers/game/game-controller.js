const Game = require('../../../db/models/Game')
const User = require('../../../db/models/User')
const gameRespository = require('../../../infrasctucture/repositories/game-repository')

/**
 * Allows to create a payload for the websoacket
 * @param {*} origin string that defines the origin action
 * @param {*} game data of the current game
 * @returns a payload
 */
const _socketMessage = (origin, game, player) => {
  let data
  switch (origin) {
    case 'move':
      data = {
        origin,
        player: player,
        newMove: true,
        id: game._id
      }
      return data
    case 'pass':
      data = {
        origin,
        player: player,
        newMove: false,
        id: game._id
      }
      return data
    case 'pass++':
      data = {
        origin,
        player: player,
        newMove: false,
        id: game._id
      }
      return data
    case 'new':
      data = {
        origin,
        player: player,
        newMove: false,
        id: game._id
      }
      return data
    default:
      break
  }
}

module.exports = {
  async getGames (req, res) {
    try {
      const results = await gameRespository.getAllGames()
      return res
        .status(200)
        .json(results)
        .end()
    } catch (error) {
      return res
        .status(400)
        .end()
    }
  },

  async getUserGames (req, res) {
    const { id } = req.params
    try {
      const results = await Game.find().or([{ blackPlayer: id }, { whitePlayer: id }])
      return res
        .status(200)
        .json(results)
        .end()
    } catch (error) {
      return res
        .status(400)
        .end()
    }
  },

  async getGame (req, res) {
    const { id } = req.params
    try {
      const gameData = await Game.findOne({ _id: id })
      const blackPlayerData = await User.findOne({ _id: gameData.blackPlayer }).select('-email -password')
      const whitePlayerData = await User.findOne({ _id: gameData.whitePlayer }).select('-email -password')

      return res
        .status(200)
        .json({ gameData, blackPlayerData, whitePlayerData })
        .end()
    } catch (error) {
      return res
        .status(400)
        .end()
    }
  },

  async addGame (req, res) {
    const { newGame, blackPlayer, whitePlayer } = req.body

    try {
      const newGameToSave = new Game(
        {
          game: newGame,
          blackPassCount: 0,
          whitePassCount: 0,
          blackPlayer,
          whitePlayer,
          currentPlayer: blackPlayer
        })

      const result = await newGameToSave.save()
      return res
        .status(200)
        .send(result)
    } catch (error) {
      return res
        .status(400)
        .send(error)
    }
  },

  async updateGame (req, res) {
    const { id } = req.params

    const { game, blackPassCount, whitePassCount, origin, player } = req.body
    const currentGame = await Game.findById(id)

    const newCurrentPlayer = String(currentGame.currentPlayer) === String(currentGame.blackPlayer)
      ? currentGame.whitePlayer
      : currentGame.blackPlayer

    try {
      const result = await Game.findOneAndUpdate({ _id: id }, {
        $set:
        {
          game: game,
          whitePassCount: whitePassCount,
          blackPassCount: blackPassCount,
          currentPlayer: newCurrentPlayer
        }
      },
      { new: true }
      )
      const payload = _socketMessage(origin, result, player)

      const socketio = req.app.get('socketIo')

      socketio.sockets.emit('gameUpdated', payload)

      return res
        .status(200)
        .send(result)
        .end()
    } catch (error) {
      return res
        .status(403)
        .json(error)
        .end()
    }
  },

  async newGame (req, res) {
    const { id } = req.params
    const { newGame, whitePassCount, blackPassCount, blackPlayer, whitePlayer, origin, isTwice, player } = req.body

    let payload
    try {
      const result = await Game.findOneAndUpdate({ _id: id },
        { $set: { game: newGame, whitePassCount, blackPassCount, blackPlayer, whitePlayer, currentPlayer: blackPlayer } },
        { new: true }
      )
      payload = _socketMessage(origin, result)
      const socketio = req.app.get('socketIo')
      if (isTwice !== null) {
        payload = _socketMessage(isTwice, result, player)
      }
      socketio.sockets.emit('gameUpdated', payload)
      return res
        .status(200)
        .send(result)
        .end()
    } catch (error) {
      return res
        .status(400)
        .json(error)
        .end()
    }
  },

  delete (req, res) {
    const { id } = req.params
    Game.deleteOne({ _id: id }).then(() => res.status(200).end()).catch(() => res.status(403).end())
  }
}
