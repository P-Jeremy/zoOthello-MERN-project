const chai = require('chai')
const chaiHttp = require('chai-http')

const { app } = require('../../../server')
const { expect } = require('chai')
const UserModel = require('../../../db/models/User')
const GameModel = require('../../../db/models/Game')
const { dropCollection } = require('../../test-helpers')

chai.use(chaiHttp)
chai.should()

describe('Acceptance | Api | gameRouter', function () {
  let gameId = ''

  after('AFTER GAMEROUTER', async function () {
    await dropCollection(GameModel)
    await dropCollection(UserModel)
  })

  let playerOneDatas
  let playerTwoDatas

  before('BEFORE GAMEROUTER', async function () {
    const playerOne = new UserModel({
      pseudo: 'playerOne',
      password: 'Tatatoto2020!',
      email: 'playerOne@example.net'
    })

    const playerTwo = new UserModel({
      pseudo: 'playerTwo',
      password: 'Tatatoto2020!',
      email: 'playerTwo@example.net'
    })

    playerOneDatas = await playerOne.save()
    playerTwoDatas = await playerTwo.save()
  })

  describe('#addGame', function () {
    it('should store a game in DB', function (done) {
      // given
      const data = {
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

  describe('#getGames', function () {
    it('should return an array of game instance', function (done) {
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

  describe('#getGame', function () {
    it('should return a specific game from its Id', function (done) {
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

    it('should return a 404 status if no game is found', function (done) {
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

  describe('#updateGameOnMove', function () {
    it('should update a  game on move', function (done) {
      // given
      const id = gameId
      const data = {
        userId: playerOneDatas._id,
        coordinates: {
          x: 3,
          y: 2
        }
      }

      // when
      chai.request(app)
        .put(`/api/game/update/move/${id}`)
        .send(data)
        .end((_err, res) => {
          // then
          res.body.should.be.a('object')
          res.body.should.have.property('_id', id)
          res.body.should.have.property('currentPlayer', String(playerTwoDatas._id))
          expect(res).to.have.status(200)
          done()
        })
    })
  })

  describe('#updateGameOnPass', function () {
    it('should update a  game on pass', function (done) {
      // given
      const id = gameId
      const data = {
        userId: playerTwoDatas._id
      }

      // when
      chai.request(app)
        .put(`/api/game/update/pass/${id}`)
        .send(data)
        .end((_err, res) => {
          // then
          res.body.should.be.a('object')
          res.body.should.have.property('_id', id)
          res.body.should.have.property('blackPassCount', 0)
          res.body.should.have.property('whitePassCount', 1)
          expect(res).to.have.status(200)
          done()
        })
    })
  })

  describe('#delete', function () {
    it('should delete one game', function (done) {
      // given
      const id = gameId
      const data = {
        userId: playerTwoDatas._id
      }

      // when
      chai.request(app)
        .put(`/api/game/delete/${id}`)
        .send(data)
        .end((_err, res) => {
          // then
          expect(res).to.have.status(200)
          expect(res.body.deletedCount).to.equal(1)
          done()
        })
    })
  })
})
