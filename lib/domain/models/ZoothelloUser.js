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
    this.hashedPassword = null
  }

  set storeHashedPassword (hash) {
    this.hashedPassword = hash
  }

  get doesGivenPasswordMatchStoredOne () {
    return (async () => {
      const result = await bcrypt.compare(
        this.password,
        this.hashedPassword
      )
      this.hashedPassword = null
      return result
    })()
  }
}

module.exports = ZoothelloUser
