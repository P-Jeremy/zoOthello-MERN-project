const chai = require('chai')
const chaiHttp = require('chai-http')

const { app, server } = require('../../../server')
const reversi = require('reversi')
const mongoose = require('mongoose')
const { expect } = require('chai')
const Reversi = reversi.Game

chai.use(chaiHttp)
chai.should()

const newGame = new Reversi()

after(async () => {
  await mongoose.connection.db.dropDatabase()
  await server.close()
})

describe('Acceptance | Api | gameRouter', () => {
  let gameId = ''

  describe('#addGame', () => {
    it('should store a game in DB', (done) => {
      // given
      const blackPassCount = 0
      const whitePassCount = 0
      const data = {
        newGame,
        blackPassCount,
        whitePassCount
      }

      // when
      chai.request(app)
        .post('/api/game')
        .send(data)
        .end((_err, res) => {
          // then
          gameId = String(res.body._id)
          res.body.should.be.a('object')
          res.body.should.have.property('_id')
          res.body.should.have.property('whitePassCount', 0)
          res.body.should.have.property('blackPassCount', 0)
          expect(res).to.have.status(200)
          done()
        })
    })
  })

  describe('#getGames', () => {
    it('should return an array of game instance', (done) => {
      // when
      chai.request(app)
        .get('/api/game')
        .end((_err, res) => {
          // then
          res.body.should.be.a('array')
          res.body.map(e => e.should.have.property('_id'))
          expect(res).to.have.status(200)
          done()
        })
    })
  })

  describe('#updateGame', () => {
    it('should update a game', (done) => {
      // given
      const id = gameId
      const blackPassCount = 1
      const whitePassCount = 0
      const data = {
        blackPassCount,
        whitePassCount
      }

      // when
      chai.request(app)
        .put(`/api/game/${id}`)
        .send(data)
        .end((_err, res) => {
          // then
          res.body.should.be.a('object')
          res.body.should.have.property('_id', id)
          res.body.should.have.property('blackPassCount', 1)
          res.body.should.have.property('whitePassCount', 0)
          expect(res).to.have.status(200)
          done()
        })
    })
  })

  describe('#delete', () => {
    it('should delete one game', (done) => {
      // given
      const id = gameId

      // when
      chai.request(app)
        .delete(`/api/game/delete/${id}`)
        .end((_err, res) => {
          // then
          expect(res).to.have.status(200)
          done()
        })
    })
  })
})
