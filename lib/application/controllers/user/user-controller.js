const NewUser = require('../../../domain/models/NewUser')
const ZoothelloUser = require('../../../domain/models/ZoothelloUser')
const useCases = require('../../../domain/useCases')
const { KnownUserError, UnauthorizedError, NotFound } = require('../../../domain/models/errors')

module.exports = {

  async addUser (req, res) {
    try {
      const user = _deserialize(req.body, NewUser)

      const response = await useCases.registerNewUser({ user })
      return res
        .status(200)
        .json(response)
    } catch (error) {
      if (error instanceof KnownUserError) {
        return res.status(409).send(error.message)
      }
      if (error instanceof UnauthorizedError) {
        return res.status(403).send(error.message)
      }
    }
  },

  async searchUsers (req, res, next) {
    const { search } = req.body
    try {
      const response = await useCases.searchUsers({ search })
      return res
        .status(200)
        .json({ fetchedUsers: response })
    } catch (error) {
      if (error instanceof NotFound) {
        return res.status(404).send(error.message)
      }
    }
  },

  async getUserInfos (req, res, next) {
    const userId = _deserialize(req.params, ZoothelloUser).id

    try {
      const response = await useCases.getUserInfos({ userId })
      return res
        .status(200)
        .json({ fetchedUser: response })
    } catch (error) {
      if (error instanceof NotFound) {
        return res.status(404).send(error.message)
      }
    }
  },

  async signIn (req, res, next) {
    const user = _deserialize(req.body, ZoothelloUser)
    try {
      const response = await useCases.signIn({ user })
      return res
        .status(200)
        .json({ fetchedUser: response })
    } catch (error) {
      if (error instanceof NotFound) {
        return res.status(404).send(error.message)
      }
      if (error instanceof UnauthorizedError) {
        return res.status(403).send(error.message)
      }
    }
  }
}

function _deserialize (payload, Instance) {
  return new Instance({
    ...payload
  })
}
