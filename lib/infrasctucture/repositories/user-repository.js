const User = require('../../db/models/User')

module.exports = {
  async isUserAlreadyKnown ({ pseudo, email }) {
    const response = {
      status: 409
    }

    const emailAlreadyRegistered = await User.findOne({ email })
    const pseudoAlreadyRegistered = await User.findOne({ pseudo })

    if (emailAlreadyRegistered) {
      response.message = 'email already used'
      return response
    } else if (pseudoAlreadyRegistered) {
      response.message = 'pseudo already taken'

      return response
    }

    return false
  },

  async registerNewUSer (user) {
    const response = {
      status: 200
    }
    const userToSave = new User({
      email: user.email,
      pseudo: user.pseudo,
      password: await user.hashPassword()
    })
    const savedUser = await userToSave.save()
    response.data = savedUser
    return response
  }
}
