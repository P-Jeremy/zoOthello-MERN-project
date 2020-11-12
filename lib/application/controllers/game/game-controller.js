const { NotFound, UnauthorizedError } = require('../../../domain/models/errors')
const useCases = require('../../../domain/useCases')

module.exports = {
  async getGames (req, res) {
    try {
      const results = await useCases.getAllGames()
      return res
        .status(200)
        .json(results)
        .end()
    } catch (error) {
      if (error instanceof NotFound) {
        return res.status(404).send(error.message)
      }
      return res
        .status(500)
        .end()
    }
  },

  async getUserGames (req, res) {
    const { id } = req.params
    try {
      const results = await useCases.getUserGames({ userId: id })
      return res
        .status(200)
        .json(results)
        .end()
    } catch (error) {
      if (error instanceof NotFound) {
        return res.status(404).send(error.message)
      }
      return res
        .status(500)
        .end()
    }
  },

  async getGame (req, res) {
    const { id } = req.params
    try {
      const result = await useCases.getOneGame({ gameId: id })
      return res
        .status(200)
        .json(result)
        .end()
    } catch (error) {
      if (error instanceof NotFound) {
        return res.status(404).send(error.message)
      }
      return res
        .status(400)
        .end()
    }
  },

  async addGame (req, res) {
    const { blackPlayer, whitePlayer } = req.body

    try {
      const result = await useCases.createGame({ blackPlayer, whitePlayer })
      return res
        .status(200)
        .send(result)
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        return res.status(403).send(error.message)
      }
      return res
        .status(400)
        .send(error)
    }
  },

  async updateGameOnMove (req, res) {
    const { id } = req.params

    const { coordinates, userId } = req.body

    try {
      const socketio = req.app.get('socketIo')

      const result = await useCases.makeAMove({ gameId: id, userId, coordinates, socketio })

      return res
        .status(200)
        .send(result)
        .end()
    } catch (error) {
      if (error instanceof NotFound) {
        return res.status(404).send(error.message)
      }
      if (error instanceof UnauthorizedError) {
        return res.status(403).send(error.message)
      }
      return res
        .status(500)
        .json(error)
        .end()
    }
  },

  async updateGameOnPass (req, res) {
    const { id } = req.params
    const { userId } = req.body

    try {
      const socketio = req.app.get('socketIo')
      const result = await useCases.passTurn({ gameId: id, userId, socketio })
      return res
        .status(200)
        .send(result)
        .end()
    } catch (error) {
      if (error instanceof NotFound) {
        return res.status(404).send(error.message)
      }
      if (error instanceof UnauthorizedError) {
        return res.status(403).send(error.message)
      }
      return res
        .status(500)
        .json(error)
        .end()
    }
  },

  async delete (req, res) {
    const { id } = req.params
    const { userId } = req.body

    try {
      const result = await useCases.deleteOneGame({ gameId: id, userId })
      return res
        .status(200)
        .send(result)
        .end()
    } catch (error) {
      if (error instanceof NotFound) {
        return res.status(404).send(error.message)
      }
      return res
        .status(500)
        .json(error)
        .end()
    }
  }
}
