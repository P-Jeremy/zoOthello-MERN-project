const User = require('../../db/models/User')
const ApiResponse = require('../../domain/models/apiResponse')

module.exports = {
  async isUserknownByPseudo (pseudo) {
    const isPseudoAlreadyRegistered = await User.findOne({ pseudo })
    if (isPseudoAlreadyRegistered) {
      return true
    }
    return false
  },

  async isUserknownByEmail (email) {
    const isEmailAlreadyRegistered = await User.findOne({ email })
    if (isEmailAlreadyRegistered) {
      return true
    }
    return false
  },

  async registerNewUSer (user) {
    const userToSave = new User({
      email: user.email,
      pseudo: user.pseudo,
      password: await user.hashPassword()
    })
    const savedUser = await userToSave.save()
    return new ApiResponse({
      statusCode: 200,
      payload: savedUser
    })
  }
}
