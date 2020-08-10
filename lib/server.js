const http = require('http')
const app = require('./app')
const socketio = require('socket.io')

const port = process.env.PORT || '3000'

app.set('port', port)
const server = http.createServer(app)
const io = socketio.listen(server)
app.set('socketIo', io)

module.exports = { app, server }

if (process.env.NODE_ENV !== 'test') {
  server.listen(port, () => console.log('Server listenning on:', port))
}
