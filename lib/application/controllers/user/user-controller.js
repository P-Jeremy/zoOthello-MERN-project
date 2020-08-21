const NewUser = require('../../../domain/models/NewUser')
const ZoothelloUser = require('../../../domain/models/ZoothelloUser')
const useCases = require('../../../domain/useCases')

module.exports = {

  async addUser (req, res) {
    try {
      const user = _deserialize(req.body, NewUser)

      const response = await useCases.registerNewUser({ user })
      return res
        .status(response.statusCode)
        .json(response.payload)
    } catch (error) {
      return res.status(error.statusCode).send(error.message)
    }
  },

  async searchUsers (req, res, next) {
    const { search } = req.body
    try {
      const response = await useCases.searchUsers({ search })
      return res
        .status(response.statusCode)
        .json({ fetchedUsers: response.payload })
    } catch (error) {
      return res.status(error.statusCode).send(error.payload)
    }
  },

  async getUserInfos (req, res, next) {
    const userId = _deserialize(req.params, ZoothelloUser).id

    try {
      const response = await useCases.getUserInfos({ userId })
      return res
        .status(response.statusCode)
        .json({ fetchedUser: response.payload })
    } catch (error) {
      return res.status(error.statusCode).send(error.payload)
    }
  },

  async signIn (req, res, next) {
    const user = _deserialize(req.body, ZoothelloUser)
    try {
      const response = await useCases.signIn({ user })
      return res
        .status(response.statusCode)
        .json({ fetchedUser: response.payload })
    } catch (error) {
      return res.status(error.statusCode).send(error.payload)
    }
  }
}

function _deserialize (payload, Instance) {
  return new Instance({
    ...payload
  })
}
