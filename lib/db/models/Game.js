
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const gameSchema = new Schema({
  blackPassCount: { type: Number, default: 0 },
  whitePassCount: { type: Number, default: 0 },
  game: { type: Object },
  score: { type: Object, default: null },
  blackPlayer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  whitePlayer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  currentPlayer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

module.exports = mongoose.model('Game', gameSchema)
