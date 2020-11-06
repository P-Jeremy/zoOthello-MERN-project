const { Game } = require('reversi')

module.exports = {
  newGame () {
    return new Game()
  }
}
