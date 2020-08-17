const chai = require('chai')
const chaiHttp = require('chai-http')

const { app, server } = require('../../../server')
const mongoose = require('mongoose')
const { expect } = require('chai')

chai.use(chaiHttp)
chai.should()

after(async () => {
  await mongoose.connection.db.dropDatabase()
  await server.close()
})

describe('Acceptance | Api | userRouter', () => {
  let userId = ''
  describe('#addUser', () => {
    it('should save a new user in DB', (done) => {
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
          userId = String(res.body._id)
          res.body.should.be.a('object')
          res.body.should.have.property('_id')
          expect(res).to.have.status(200)
          done()
        })
    })

    it('should send a status 409 when a user already exists with a given email', (done) => {
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

    it('should send a status 409 when a user already exists with a given pseudo', (done) => {
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

    it('should send a status 409 when a user try to signup with wrong format pseudo', (done) => {
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
          expect(res).to.have.status(409)
          expect(res.body.message).to.be.equal('Invalid pseudo format')
          done()
        })
    })

    it('should send a status 409 when a user try to signup with wrong format password', (done) => {
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
          expect(res).to.have.status(409)
          expect(res.body.message).to.be.equal('Password weak')
          done()
        })
    })
  })
  describe('#searchUsers', () => {
    it('should find an existing user in DB', (done) => {
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

    it('should NOT find a user in DB', (done) => {
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

  describe('#getUserInfos', () => {
    it('should find an existing user in DB', (done) => {
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

    it('should NOT find a user in DB', (done) => {
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

  describe('#signin', () => {
    it('should allow an existing user in DB to signin with rigth credentials', (done) => {
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

    it('should NOT allow an existing user in DB to signin with wrong pseudo', (done) => {
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
