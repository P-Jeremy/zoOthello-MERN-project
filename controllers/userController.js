const User = require('../models/User')
const bcrypt = require('bcryptjs')

module.exports = class UserController {
  async addUser (req, res) {
    const { email, pseudo, password } = req.body
    const hash = await bcrypt.hash(password, 10)
    const foundUser = await User.findOne({ pseudo: pseudo })
    if (foundUser) res.status(403).json({ message: 'User alread exists' })
    try {
      const newUser = new User({
        email,
        pseudo,
        password: hash
      })
      const result = await newUser.save()
      return res.status(200).json(result)
    } catch (error) {
      res.status(500).json(error.message)
    }
  }

  async searchUser (req, res, next) {
    const { search } = req.body
    const userRegex = new RegExp('^' + search, 'i')
    const fetchedUsers = await User.find({ pseudo: { $regex: userRegex } })
    return res.status(200).json({ fetchedUsers })
  }

  async getUserInfo (req, res, next) {
    const { id } = req.params
    const fetchedUsers = await User.find({ _id: id })
    return res.status(200).json({ fetchedUsers })
  }

  /** Allows a user to signin */
  async signIn (req, res, next) {
    const fetchedUser = await User.findOne({ pseudo: req.body.pseudo })
    if (!fetchedUser) {
      return res.status(403).json({
        message: "User doesn't"
      })
    }
    try {
      const allowedUser = await bcrypt.compare(
        req.body.password,
        fetchedUser.password
      )
      if (allowedUser) {
        return res.status(200).json({ fetchedUser })
      }
    } catch (error) {
      return res.status(500).json(
        error.message
      )
    }
  };
}
