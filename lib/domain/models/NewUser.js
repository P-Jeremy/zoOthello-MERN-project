const bcrypt = require('bcryptjs')
const { UnauthorizedError } = require('./errors')

const validPassword = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$'

class NewUser {
  constructor ({
    pseudo,
    password,
    email
  } = {}) {
    this.pseudo = pseudo
    this.password = password
    this.email = email

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

  async hashPassword () {
    const hash = await bcrypt.hash(this.password, 10)
    return hash
  }
}

module.exports = NewUser
