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

describe('Acceptance | Api | userController', () => {
  describe('POST /', () => {
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
})
