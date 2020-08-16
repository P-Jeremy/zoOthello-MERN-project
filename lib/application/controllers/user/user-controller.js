const User = require('../../../db/models/User')
const NewUser = require('../../../domain/models/NewUser')
const useCases = require('../../../domain/useCases')

module.exports = {

  async addUser (req, res) {
    const user = _deserialize(req.body)

    if (user.passwordNotStrongEnough()) return res.status(409).send({ message: 'Password weak' })

    if (user.invalidPseudoFormat()) return res.status(409).send({ message: 'Invalid pseudo format' })

    try {
      const response = await useCases.registerNewUser({ user })
      return res
        .status(response.statusCode)
        .json(response.payload)
    } catch (error) {
      return res.status(error.statusCode).send(error.payload)
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
    const newUser = _deserialize(req.body)
    const fetchedUser = await User.findOne({ pseudo: newUser.pseudo })
    if (!fetchedUser) {
      return res.status(403).send({
        message: "User doesn't exist"
      })
    }
    try {
      if (await _isPasswordCorrect(newUser, fetchedUser.password)) {
        return res.status(200).json({ fetchedUser })
      } else {
        return res.status(403).send({
          message: "User doesn't exist"
        })
      }
    } catch (error) {
      return res.status(500).json(
        error.message
      )
    }
  }
}

async function _isPasswordCorrect (newUser, storedPassword) {
  return await newUser.isPasswordMatchingStoredHash(storedPassword)
}

function _deserialize (payload) {
  return new NewUser({
    id: payload.id,
    email: payload.email,
    pseudo: payload.pseudo,
    password: payload.password
  })
}
