const reversi = require('../../../node_modules/reversi/index')
const Reversi = reversi.Game

const chaiHttp = require('chai-http')

const app = require('../../../server')
const chai = require('chai')

chai.use(chaiHttp)
chai.should()

const newGame = new Reversi()

describe('Acceptance | Api | gameController', () => {
  let gameId = ''
  describe('POST /', () => {
    it('should store a game in DB', (done) => {
      const blackPassCount = 0
      const whitePassCount = 0
      const data = {
        newGame,
        blackPassCount,
        whitePassCount
      }
      chai.request(app)
        .post('/api/game')
        .send(data)
        .end((_err, res) => {
          gameId = String(res.body._id)
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('_id')
          res.body.should.have.property('whitePassCount', 0)
          res.body.should.have.property('blackPassCount', 0)
          done()
        })
    })
  })

  describe('GET /', () => {
    it('should return an array of game instance', (done) => {
      chai.request(app)
        .get('/api/game')
        .end((_err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('array')
          res.body.map(e => e.should.have.property('_id'))
          done()
        })
    })
  })

  describe('UPDATE /', () => {
    it('should update a game', (done) => {
      /** We use the POST test game _id */
      const id = gameId
      const blackPassCount = 1
      const whitePassCount = 0
      const data = {
        blackPassCount,
        whitePassCount
      }
      chai.request(app)
        .put(`/api/game/${id}`)
        .send(data)
        .end((_err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('_id', id)
          res.body.should.have.property('blackPassCount', 1)
          res.body.should.have.property('whitePassCount', 0)
          done()
        })
    })
  })

  describe('DELETE /', () => {
    it('should delete one game', (done) => {
      const id = gameId
      chai.request(app)
        .delete(`/api/game/delete/${id}`)
        .end((_err, res) => {
          res.should.have.status(200)
          done()
        })
    })
  })
})
