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

    this.isPseudoToValidFormat()

    this.isPasswordStrongEnough()
  }

  isPasswordStrongEnough () {
    const regex = new RegExp(validPassword)
    const isFormatValid = regex.test(this.password)
    if (!isFormatValid) {
      throw new UnauthorizedError({
        message: 'Password weak'
      })
    }
    return isFormatValid
  }

  isPseudoToValidFormat () {
    const regex = new RegExp(validPseudo)
    const isFormatValid = regex.test(this.pseudo)
    if (!isFormatValid) {
      throw new UnauthorizedError({
        message: 'Invalid pseudo format'
      })
    }
    return isFormatValid
  }

  get hashedPassword () {
    return (async () => {
      const hash = await bcrypt.hash(this.password, 10)
      return hash
    })()
  }
}

module.exports = NewUser
