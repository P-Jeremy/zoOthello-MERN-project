const chai = require('chai')
const chaiHttp = require('chai-http')

const { app, server } = require('../../../server')
const { Game } = require('reversi')
const mongoose = require('mongoose')
const { expect } = require('chai')
const User = require('../../../db/models/User')

chai.use(chaiHttp)
chai.should()

after(async () => {
  await mongoose.connection.db.dropDatabase()
  await server.close()
})

let playerOneDatas
let playerTwoDatas

const playerOne = new User({
  pseudo: 'playerOne',
  password: 'Tatatoto2020!',
  email: 'playerOne@example.net'
})

const playerTwo = new User({
  pseudo: 'playerTwo',
  password: 'Tatatoto2020!',
  email: 'playerOne@example.net'
})

beforeEach(async () => {
  playerOneDatas = await playerOne.save()
  playerTwoDatas = await playerTwo.save()
})

describe('Acceptance | Api | gameRouter', () => {
  let gameId = ''

  describe('#addGame', () => {
    it('should store a game in DB', (done) => {
      // given
      const newGame = new Game()
      const data = {
        newGame,
        blackPlayer: playerOneDatas._id,
        whitePlayer: playerTwoDatas._id
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

  describe('#getGame', () => {
    it('should return a specific game from its Id', (done) => {
      // given
      const id = gameId
      // when
      chai.request(app)
        .get(`/api/game/one/${id}`)
        .end((_err, res) => {
          // then
          res.body.should.be.a('object')
          res.body.should.have.property('gameData')
          res.body.should.have.property('whitePlayerData')
          res.body.should.have.property('blackPlayerData')
          expect(res).to.have.status(200)
          done()
        })
    })

    it('should return a 404 status if no game is found', (done) => {
      // given
      const wrongId = require('mongoose').Types.ObjectId()
      // when
      chai.request(app)
        .get(`/api/game/one/${wrongId}`)
        .end((_err, res) => {
          // then
          expect(res).to.have.status(404)
          done()
        })
    })
  })

  describe('#updateGameOnPass', () => {
    it('should update a  game on pass', (done) => {
      // given
      const id = gameId
      const data = {
        userId: playerOneDatas._id
      }

      // when
      chai.request(app)
        .put(`/api/game/update/pass/${id}`)
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
