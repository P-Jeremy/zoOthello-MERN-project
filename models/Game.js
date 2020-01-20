
const mongoose = require('mongoose')
var Schema = mongoose.Schema

const gameSchema = new Schema({
  blackPassCount: { type: Number, default: 0 },
  whitePassCount: { type: Number, default: 0 },
  game: { type: Object }
})

module.exports = mongoose.model('Game', gameSchema)
