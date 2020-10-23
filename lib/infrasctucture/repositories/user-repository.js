const User = require('../../db/models/User')
const { NotFound, UnauthorizedError } = require('../../domain/models/errors')
const ZoothelloUser = require('../../domain/models/ZoothelloUser')

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
      password: user.password
    })
    try {
      const savedUser = await userToSave.save()
      return new ZoothelloUser({
        id: savedUser._id,
        pseudo: savedUser.pseudo
      })
    } catch {
      return new UnauthorizedError('User already known')
    }
  },

  async searchUsersByRegex (searchInput) {
    const searchRegex = new RegExp('^' + searchInput, 'i')
    const result = await User.find({ pseudo: { $regex: searchRegex } })
    if (result.length < 1) throw new NotFound()
    return result
  },

  async getUserInfos (key) {
    const fetchedUser = await User.find(key)
    if (fetchedUser.length < 1) throw new NotFound()
    return fetchedUser[0]
  },

  async signIn (potentialZoothelloUser) {
    const fetchedUser = await User.find({ pseudo: potentialZoothelloUser.pseudo })
    const arePasswordsMatching = await _isPasswordCorrect(potentialZoothelloUser, fetchedUser[0].password)
    if (!arePasswordsMatching) throw new UnauthorizedError()
    return new ZoothelloUser({
      id: fetchedUser[0]._id,
      pseudo: fetchedUser[0].pseudo
    })
  }
}

async function _isPasswordCorrect (potentialZoothelloUser, storedPassword) {
  return await potentialZoothelloUser.isPasswordMatchingStoredHash(storedPassword)
}
