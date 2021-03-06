require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const gameRouter = require('./application/controllers/game')
const userRouter = require('./application/controllers/user')
const mongoConf = process.env.MONGO_CONFIG_URL
const path = require('path')
const app = express()

const DIST_DIR = path.join(__dirname, '../react/dist')
const HTML_FILE = path.join(DIST_DIR, 'index.html')

mongoose
  .connect(mongoConf, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('Connected to DB!')
  })
  .catch(() => {
    console.log(' Unable to connect to DB...')
  })

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.URI || '*')
  next()
})
app.use(express.static(DIST_DIR))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/api/game', gameRouter)
app.use('/api/user', userRouter)

app.get('/*', (_req, res) => {
  res.sendFile(HTML_FILE, function (err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})

module.exports = app
