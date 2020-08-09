const chai = require('chai')
const chaiHttp = require('chai-http')

const { app, server } = require('../../../server')
const mongoose = require('mongoose')
const { expect } = require('chai')

chai.use(chaiHttp)
chai.should()

afterAll(async () => {
  await mongoose.connection.db.dropDatabase()
  await mongoose.connection.close()
  await server.close()
})

describe('Acceptance | Api | userRouter', () => {
  let userId = ''
  describe('POST /api/user/', () => {
    it('should save a new user in DB', (done) => {
      const data = {
        pseudo: 'zenikanard',
        password: 'Tatatoto2020!',
        email: 'zenikanard@example.net'
      }
      chai.request(app)
        .post('/api/user')
        .send(data)
        .then(res => {
          userId = String(res.body._id)
          res.body.should.be.a('object')
          res.body.should.have.property('_id')
          expect(res).to.have.status(200)
          done()
        })
    })

    it('should send a status 404 when a user already exists with a given email', (done) => {
      const data = {
        pseudo: 'Tatayoyo',
        password: 'Tatatoto2020!',
        email: 'zenikanard@example.net'
      }
      chai.request(app)
        .post('/api/user')
        .send(data)
        .end((_err, res) => {
          expect(res).to.have.status(409)
          done()
        })
    })

    it('should send a status 404 when a user already exists with a given pseudo', (done) => {
      const data = {
        pseudo: 'zenikanard',
        password: 'Tatatoto2020!',
        email: 'tataYoyo@example.net'
      }
      chai.request(app)
        .post('/api/user')
        .send(data)
        .end((_err, res) => {
          expect(res).to.have.status(409)
          done()
        })
    })
  })

  describe('POST api/user/search', () => {
    it('should find an existing user in DB', (done) => {
      const data = {
        search: 'zenikanard'
      }
      chai.request(app)
        .post('/api/user/search')
        .send(data)
        .then(res => {
          const { fetchedUsers } = res.body
          expect(fetchedUsers).to.be.instanceOf(Array)
          expect(fetchedUsers.length).to.be.equal(1)
          expect(res).to.have.status(200)
          done()
        })
    })
  })

  describe('POST api/user/search', () => {
    it('should not find users in DB', (done) => {
      const data = {
        search: 'kanard'
      }
      chai.request(app)
        .post('/api/user/search')
        .send(data)
        .then(res => {
          expect(res).to.have.status(404)
          done()
        })
    })
  })

  describe('GET api/user/:id', () => {
    it('should get one user from DB', (done) => {
      chai.request(app)
        .get(`/api/user/${userId}`)
        .then(res => {
          res.body.should.be.a('object')
          res.body.fetchedUser[0].should.have.property('_id', userId)
          expect(res).to.have.status(200)
          done()
        })
    })
  })

  describe('POST api/user/signin', () => {
    it('should allow one user to connect with right credentials', (done) => {
      const user = {
        pseudo: 'zenikanard',
        password: 'Tatatoto2020!'
      }
      chai.request(app)
        .post('/api/user/signin')
        .send(user)
        .then(res => {
          res.body.should.be.a('object')
          res.body.fetchedUser.should.have.property('_id', userId)
          expect(res).to.have.status(200)
          done()
        })
    })

    it('should send a 403 status if a user tries to login with wrong pseudo', (done) => {
      const user = {
        pseudo: 'kanard',
        password: 'Tatatoto2020!'
      }
      chai.request(app)
        .post('/api/user/signin')
        .send(user)
        .then(res => {
          expect(res).to.have.status(403)
          done()
        })
    })

    it('should send a 403 status if a user tries to login with wrong password', (done) => {
      const user = {
        pseudo: 'zenikanard',
        password: 'Tatatoto'
      }
      chai.request(app)
        .post('/api/user/signin')
        .send(user)
        .then(res => {
          expect(res).to.have.status(403)
          done()
        })
    })
  })
})
