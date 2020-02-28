
const mongoose = require('mongoose')
var Schema = mongoose.Schema

const gameSchema = new Schema({
  blackPassCount: { type: Number, default: 0 },
  whitePassCount: { type: Number, default: 0 },
  game: { type: Object },
  blackPlayer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  whitePlayer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

module.exports = mongoose.model('Game', gameSchema)
