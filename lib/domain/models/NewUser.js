const bcrypt = require('bcryptjs')

const validPassword = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/gm
const validPseudo = /^[A-z0-9_-]{3,15}$/gm

class NewUser {
  constructor ({
    id,
    pseudo,
    password,
    email
  } = {}) {
    this.id = id
    this.pseudo = pseudo
    this.password = password
    this.email = email
  }

  isPasswordStrongEnough () {
    return this.password.match(validPassword)
  }

  isNewPseudoValid () {
    return this.pseudo.match(validPseudo)
  }

  async hashPassword () {
    const hash = await bcrypt.hash(this.password, 10)
    return hash
  }

  async isPasswordMatchingStoredHash (hashedPassword) {
    return await bcrypt.compare(
      this.password,
      hashedPassword
    )
  }
}

module.exports = NewUser
