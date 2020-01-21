const User = require('../models/User')
const bcrypt = require('bcryptjs')

module.exports = class UserController {
  async addUser (req, res) {
    console.log('COUCOU', req.body)

    const { email, pseudo, password } = req.body
    const hash = await bcrypt.hash(password, 10)
    console.log('HASH', hash)

    const foundUser = await User.findOne({ pseudo: pseudo })
    if (foundUser) res.status(403).json({ message: 'User alread exists' })
    try {
      const newUser = new User({
        email,
        pseudo,
        password: hash
      })
      console.log('NEWUSER', newUser)

      const result = await newUser.save()
      console.log('RESULT', result)

      return res.status(200).json(result)
    } catch (error) {
      res.status(500).json(error.message)
    }
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
      return res.status(200).json({ allowedUser })
    } catch (error) {
      return res.status(403).json(
        error.message
      )
    }
  };
}
