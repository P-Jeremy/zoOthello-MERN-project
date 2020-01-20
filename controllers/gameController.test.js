// Import the dependencies for testing
const chaiHttp = require('chai-http')

/** App exported from server.js */
const app = require('../server')
const chai = require('chai')

/** Reversi lib */
const reversi = require('../othello-react/node_modules/reversi/index')
const Reversi = reversi.Game

const newGame = new Reversi()

// Configure chai
chai.use(chaiHttp)
chai.should()

describe('Games', () => {
  /** This will be updated after the POST test */
  let gameId = ''
  /** POST TEST
   * We insert a fake Game in DB and we test
   * the properties of the response object
   */
  describe('POST /', () => {
    // Test to post a single game
    it('should post game', (done) => {
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

  /** GET test */
  describe('GET /', () => {
    // Test to get all games
    it('should get all games', (done) => {
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

  /** UPDATE TEST */
  describe('UPDATE /', () => {
    // Test to update single game
    it('should update game', (done) => {
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
          /** We check the response status, type and properties */
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('_id', id)
          res.body.should.have.property('blackPassCount', 1)
          res.body.should.have.property('whitePassCount', 0)
          done()
        })
    })
  })

  /** DELETE test
   * In this final test we delete the fake game created by the POST test
   */
  describe('DELETE /', () => {
    // Test to delete single game
    it('should delete game', (done) => {
      const id = gameId
      chai.request(app)
        .delete(`/api/game/delete/${id}`)
        .end((_err, res) => {
          /** We check the response status */
          res.should.have.status(200)
          done()
        })
    })
  })
})
