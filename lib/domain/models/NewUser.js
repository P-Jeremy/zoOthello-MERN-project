
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
}

module.exports = NewUser
