const bcrypt = require('bcryptjs')
const { UnauthorizedError } = require('./errors')

const validPassword = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$'
const validPseudo = '^[A-z0-9_-]{3,15}$'

class NewUser {
  constructor ({
    pseudo,
    password,
    email
  } = {}) {
    this.pseudo = pseudo
    this.password = password
    this.email = email

    if (!this.isPseudoToValidFormat()) {
      throw new UnauthorizedError({
        message: 'Invalid pseudo format'
      })
    }

    if (!this.isPasswordStrongEnough()) {
      throw new UnauthorizedError({
        message: 'Password weak'
      })
    }
  }

  isPasswordStrongEnough () {
    const regex = new RegExp(validPassword)
    const result = regex.test(this.password)
    return result
  }

  isPseudoToValidFormat () {
    const regex = new RegExp(validPseudo)
    const result = regex.test(this.pseudo)
    return result
  }

  async hashPassword () {
    const hash = await bcrypt.hash(this.password, 10)
    return hash
  }
}

module.exports = NewUser
