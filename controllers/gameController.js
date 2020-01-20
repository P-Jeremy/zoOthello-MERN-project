const Game = require('../models/Game')

/**
 * Allows to create a payload for the websoacket
 * @param {*} origin string that defines the origin action
 * @param {*} game data of the current game
 * @returns a payload
 */
const socketMessage = (origin, game) => {
  let data
  switch (origin) {
    case 'move':
      data = {
        origin,
        player: `${game._nextPieceType === 'BLACK' ? 'blanc' : 'noir'}`,
        newMove: true
      }
      return data
    case 'pass':
      data = {
        origin,
        player: `${game._nextPieceType === 'BLACK' ? 'blanc' : 'noir'}`,
        newMove: false
      }
      return data
    case 'pass++':
      data = {
        origin,
        player: `${game._nextPieceType === 'BLACK' ? 'blanc' : 'noir'}`,
        newMove: false
      }
      return data
    case 'new':
      data = {
        origin,
        player: `${game._nextPieceType === 'BLACK' ? 'blanc' : 'noir'}`,
        newMove: false
      }
      return data
    default:
      break
  }
}

module.exports = class GameController {
  /** Get all the game in Db */
  async getGames (req, res) {
    try {
      const results = await Game.find()
      return res
        .status(200)
        .json(results)
        .end()
    } catch (error) {
      return res
        .status(400)
        .end()
    }
  };

  /** Get one game */
  async getGame (req, res) {
    const { id } = req.params
    try {
      const result = await Game.findOne({ _id: id })
      return res
        .status(200)
        .json(result)
        .end()
    } catch (error) {
      return res
        .status(400)
        .end()
    }
  };

  /** Add a game in DB */
  async addGame (req, res) {
    const { newGame, blackPassCount, whitePassCount, origin, isTwice } = req.body
    let payload
    try {
      const newGameToSave = new Game(
        {
          game: newGame,
          blackPassCount: blackPassCount,
          whitePassCount: whitePassCount
        })
      const result = await newGameToSave.save()
      payload = socketMessage(origin, result)
      const socketio = req.app.get('socketIo')
      if (isTwice) {
        payload = socketMessage(origin, isTwice)
      }
      socketio.sockets.emit('gameUpdated', payload)
      return res
        .status(200)
        .send(result)
    } catch (error) {
      return res
        .status(400)
        .send(error)
    }
  };

  /** Update a game */
  async updateGame (req, res) {
    const { id } = req.params

    const { game, blackPassCount, whitePassCount, origin } = req.body
    try {
      const result = await Game.findOneAndUpdate({ _id: id }, {
        $set:
        {
          game: game,
          whitePassCount: whitePassCount,
          blackPassCount: blackPassCount
        }
      },
      { new: true }
      )
      const payload = socketMessage(origin, game)
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
  };

  /** Upsert a game in DB */
  async newGame (req, res) {
    const { id } = req.params
    const { newGame, whitePassCount, blackPassCount, origin, isTwice } = req.body
    let payload
    try {
      const result = await Game.findOneAndUpdate({ _id: id },
        { $set: { game: newGame, whitePassCount, blackPassCount } },
        { new: true }
      )
      payload = socketMessage(origin, result)
      const socketio = req.app.get('socketIo')
      if (isTwice !== null) {
        payload = socketMessage(isTwice, result)
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
  }

  /** Delete a game in DB */
  delete (req, res) {
    const { id } = req.params
    console.log('DELETE')

    Game.deleteOne({ _id: id }).then(() => res.status(200).end()).catch(() => res.status(403).end())

    // try {
    //   const gameToDelete = await Game.findOne({ _id: id })
    //   const result = await Game.deleteOne({ _id: gameToDelete._id })
    //   console.log('RESULT DELETE', result)

    //   return res
    //     .status(200)
    //     .send(gameToDelete)
    //     .end()
    // } catch (error) {
    //   return res
    //     .status(400)
    //     .json(error)
    //     .end()
    // }
  }
}
