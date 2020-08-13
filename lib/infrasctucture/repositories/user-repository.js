const User = require('../../db/models/User')
const ApiResponse = require('../../domain/models/apiResponse')
const KnowUserError = require('../../domain/models/errors')

module.exports = {
  async isUserUnknown ({ pseudo, email }) {
    const emailAlreadyRegistered = await User.findOne({ email })
    const pseudoAlreadyRegistered = await User.findOne({ pseudo })

    if (emailAlreadyRegistered) {
      throw new KnowUserError('email already used')
    } else if (pseudoAlreadyRegistered) {
      throw new KnowUserError('pseudo already used')
    }
    return true
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
