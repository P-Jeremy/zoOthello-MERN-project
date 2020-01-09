const express = require('express')
const path = require('path')
const app = express()

const DIST_DIR = path.join(__dirname, './dist')
const HTML_FILE = path.join(DIST_DIR, 'index.html')

app.use(express.static(DIST_DIR))
app.get('/', (_req, res) => {
  res.sendFile(HTML_FILE)
})
app.use(express.static('public'))
app.listen(3000, () => console.log('App listening on port 3000!'))
