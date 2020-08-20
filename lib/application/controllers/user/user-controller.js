const UserModel = require('../../../domain/models/User')
const useCases = require('../../../domain/useCases')

module.exports = {

  async addUser (req, res) {
    const user = _deserialize(req.body)

    if (!user.isPasswordStrongEnough()) return res.status(409).json({ message: 'Password weak' })

    if (!user.isPseudoToValidFormat()) return res.status(409).json({ message: 'Invalid pseudo format' })

    try {
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
    const userId = _deserialize(req.params).id

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
    const user = _deserialize(req.body)
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

function _deserialize (payload) {
  return new UserModel({
    id: payload.id,
    email: payload.email,
    pseudo: payload.pseudo,
    password: payload.password
  })
}
