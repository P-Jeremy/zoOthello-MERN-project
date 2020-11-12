const chai = require('chai')
const chaiHttp = require('chai-http')

const { app } = require('../../../server')
const { expect } = require('chai')
const { dropCollection } = require('../../test-helpers')
const User = require('../../../db/models/User')

chai.use(chaiHttp)
chai.should()

describe('Acceptance | Api | userRouter', function () {
  let userId = ''

  after('AFTER USERROUTER', async function () {
    await dropCollection(User)
  })

  describe('#addUser', function () {
    it('should save a new user in DB', function (done) {
      // given
      const data = {
        pseudo: 'zenikanard',
        password: 'Tatatoto2020!',
        email: 'zenikanard@example.net'
      }

      // when
      chai.request(app)
        .post('/api/user')
        .send(data)
        .then(res => {
          // then
          userId = String(res.body.id)
          res.body.should.be.a('object')
          res.body.should.have.property('id')
          expect(res).to.have.status(200)
          done()
        })
    })

    it('should send a status 409 when a user already exists with a given email', function (done) {
      // given
      const data = {
        pseudo: 'Tatayoyo',
        password: 'Tatatoto2020!',
        email: 'zenikanard@example.net'
      }

      // when
      chai.request(app)
        .post('/api/user')
        .send(data)
        .end((_err, res) => {
          // then
          expect(res).to.have.status(409)
          done()
        })
    })

    it('should send a status 409 when a user already exists with a given pseudo', function (done) {
      // given
      const data = {
        pseudo: 'zenikanard',
        password: 'Tatatoto2020!',
        email: 'tataYoyo@example.net'
      }

      // when
      chai.request(app)
        .post('/api/user')
        .send(data)
        .end((_err, res) => {
          // then
          expect(res).to.have.status(409)
          done()
        })
    })

    it('should send a status 403 when a user try to signup with wrong format pseudo', function (done) {
      // given
      const data = {
        pseudo: 'yo',
        password: 'Tatatoto2020!',
        email: 'zenikanard@example.net'
      }

      // when
      chai.request(app)
        .post('/api/user')
        .send(data)
        .end((_err, res) => {
          // then
          expect(res).to.have.status(403)
          expect(res.body.message).to.be.equal('Invalid pseudo format')
          done()
        })
    })

    it('should send a status 403 when a user try to signup with wrong format password', function (done) {
      // given
      const data = {
        pseudo: 'Tatayoyo',
        password: 'lol',
        email: 'zenikanard@example.net'
      }

      // when
      chai.request(app)
        .post('/api/user')
        .send(data)
        .end((_err, res) => {
          // then
          expect(res).to.have.status(403)
          expect(res.body.message).to.be.equal('Password weak')
          done()
        })
    })
  })
  describe('#searchUsers', function () {
    it('should find an existing user in DB', function (done) {
      // given
      const data = {
        search: 'zenikan'
      }

      // when
      chai.request(app)
        .post('/api/user/search')
        .send(data)
        .then(res => {
          // then
          const { fetchedUsers } = res.body
          expect(fetchedUsers.length).to.be.equal(1)
          expect(res).to.have.status(200)
          done()
        })
    })

    it('should NOT find a user in DB', function (done) {
      // given
      const data = {
        search: 'POPOPO'
      }

      // when
      chai.request(app)
        .post('/api/user/search')
        .send(data)
        .then(res => {
          // then
          expect(res).to.have.status(404)
          done()
        })
    })
  })

  describe('#getUserInfos', function () {
    it('should find an existing user in DB', function (done) {
      // when
      chai.request(app)
        .get(`/api/user/${userId}`)
        .then(res => {
          // then
          const { fetchedUser } = res.body
          expect(fetchedUser).to.have.property('_id')
          expect(res).to.have.status(200)
          done()
        })
    })

    it('should NOT find a user in DB', function (done) {
      // given
      const wrongId = require('mongoose').Types.ObjectId()

      // when
      chai.request(app)
        .get(`/api/user/${wrongId}`)
        .then(res => {
          // then
          expect(res).to.have.status(404)
          done()
        })
    })
  })

  describe('#signin', function () {
    it('should allow an existing user in DB to signin with rigth credentials', function (done) {
      // given
      const data = {
        pseudo: 'zenikanard',
        password: 'Tatatoto2020!'
      }

      // when
      chai.request(app)
        .post('/api/user/signin')
        .send(data)
        .then(res => {
          // then
          expect(res).to.have.status(200)
          done()
        })
    })

    it('should NOT allow an existing user in DB to signin with wrong pseudo', function (done) {
      // given
      const data = {
        pseudo: 'zenikafard',
        password: 'Tatatoto2020!'
      }

      // when
      chai.request(app)
        .post('/api/user/signin')
        .send(data)
        .then(res => {
          // then
          expect(res).to.have.status(404)
          done()
        })
    })
  })
})
