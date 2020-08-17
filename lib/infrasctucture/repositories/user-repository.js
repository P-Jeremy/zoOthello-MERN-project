const User = require('../../db/models/User')
const ApiResponse = require('../../domain/models/ApiResponse')
const { NotFound, UnauthorizedError } = require('../../domain/models/errors')

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
    try {
      const savedUser = await userToSave.save()
      return new ApiResponse({
        statusCode: 200,
        payload: savedUser
      })
    } catch {
      return new ApiResponse({
        statusCode: 403,
        payload: 'User already known'
      })
    }
  },

  async searchUsersByRegex (searchInput) {
    const searchRegex = new RegExp('^' + searchInput, 'i')
    const result = await User.find({ pseudo: { $regex: searchRegex } })
    if (result.length < 1) throw new NotFound()
    return new ApiResponse({
      statusCode: 200,
      payload: result
    })
  },

  async getUserInfos (key) {
    const fetchedUser = await User.find(key)
    if (fetchedUser.length < 1) throw new NotFound()
    return new ApiResponse({
      statusCode: 200,
      payload: fetchedUser[0]
    })
  },

  async signIn (user) {
    const fetchedUser = await User.find({ pseudo: user.pseudo })
    const arePasswordsMatching = await _isPasswordCorrect(user, fetchedUser[0].password)
    if (!arePasswordsMatching) throw new UnauthorizedError()
    return new ApiResponse({
      statusCode: 200,
      payload: fetchedUser[0]
    })
  }
}

async function _isPasswordCorrect (user, storedPassword) {
  return await user.isPasswordMatchingStoredHash(storedPassword)
}
