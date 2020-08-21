const bcrypt = require('bcryptjs')

class ZoothelloUser {
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

  async isPasswordMatchingStoredHash (hashedPassword) {
    return await bcrypt.compare(
      this.password,
      hashedPassword
    )
  }
}

module.exports = ZoothelloUser
