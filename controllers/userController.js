const User = require('../models/User')
const bcrypt = require('bcryptjs')

const validPassword = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/gm
const validPseudo = /^[A-z0-9_-]{3,15}$/gm

module.exports = class UserController {
  async addUser (req, res) {
    const { email, pseudo, password } = req.body

    if (!password.match(validPassword)) res.status(409).send({ message: 'invalidPassword' })
    if (!pseudo.match(validPseudo)) res.status(409).send({ message: 'invalidPseudo' })

    const hash = await bcrypt.hash(password, 10)
    const foundUserByPseudo = await User.findOne({ pseudo: pseudo })
    const foundUserByEmail = await User.findOne({ email: email })

    if (foundUserByEmail) return res.status(409).send({ message: 'email already used' })
    if (foundUserByPseudo) return res.status(409).send({ message: 'pseudo already used' })

    try {
      const newUser = new User({
        email,
        pseudo,
        password: hash
      })
      const result = await newUser.save()
      return res.status(200).json(result)
    } catch (error) {
      res.status(500).send(error.message)
    }
  }

  async searchUsers (req, res, next) {
    const { search } = req.body
    const userRegex = new RegExp('^' + search, 'i')
    const fetchedUsers = await User.find({ pseudo: { $regex: userRegex } })
    if (fetchedUsers.length < 1) return res.status(404).end()
    return res.status(200).json({ fetchedUsers })
  }

  async getUserInfo (req, res, next) {
    const { id } = req.params
    const fetchedUser = await User.find({ _id: id })
    if (fetchedUser.length < 1) return res.status(404).end()
    return res.status(200).json(fetchedUser)
  }

  async signIn (req, res, next) {
    const fetchedUser = await User.findOne({ pseudo: req.body.pseudo })
    if (!fetchedUser) {
      return res.status(403).send({
        message: "User doesn't exist"
      })
    }
    try {
      const allowedUser = await bcrypt.compare(
        req.body.password,
        fetchedUser.password
      )
      if (allowedUser) {
        return res.status(200).json({ fetchedUser })
      } else {
        return res.status(403).send({
          message: "User doesn't"
        })
      }
    } catch (error) {
      return res.status(500).json(
        error.message
      )
    }
  };
}
