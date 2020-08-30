const bcrypt = require('bcryptjs')

class NewUser {
  constructor ({
    pseudo,
    password,
    email
  } = {}) {
    this.pseudo = pseudo
    this.password = password
    this.email = email
  }

  async hashPassword () {
    const hash = await bcrypt.hash(this.password, 10)
    return hash
  }
}

module.exports = NewUser
