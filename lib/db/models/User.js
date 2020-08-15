
const mongoose = require('mongoose')
var Schema = mongoose.Schema

const userSchema = new Schema({
  pseudo: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

module.exports = mongoose.model('User', userSchema)