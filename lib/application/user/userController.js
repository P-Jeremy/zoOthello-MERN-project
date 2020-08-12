const User = require('../../db/models/User')
const NewUser = require('../../domain/models/NewUser')
const useCases = require('../../domain/useCases')

module.exports = {

  async addUser (req, res) {
    const user = _deserialize(req.body)

    if (!user.isPasswordStrongEnough()) res.status(409).send({ message: 'invalidPassword' })

    if (!user.isNewPseudoValid()) res.status(409).send({ message: 'invalidPseudo' })

    try {
      const response = await useCases.registerNewUser({ user })
      response.payload = response.data ? response.data : response.message
      return res
        .status(response.status)
        .json(response.payload)
    } catch (error) {
      return res.status(500).send(error.message)
    }
  },

  async searchUsers (req, res, next) {
    const newUser = _deserialize(req.body)
    const userRegex = new RegExp('^' + newUser.pseudo, 'i')
    const fetchedUsers = await User.find({ pseudo: { $regex: userRegex } })
    if (fetchedUsers.length < 1) return res.status(404).end()
    return res.status(200).json({ fetchedUsers })
  },

  async getUserInfo (req, res, next) {
    const newUser = _deserialize(req.params)

    const fetchedUser = await User.find({ _id: newUser.id })
    if (fetchedUser.length < 1) return res.status(404).end()
    return res.status(200).json({ fetchedUser })
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
