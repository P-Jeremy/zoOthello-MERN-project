const User = require('../../../../../db/models/User')
const ApiResponse = require('../../../../../domain/models/apiResponse')
const NewUser = require('../../../../../domain/models/NewUser')
const userRepository = require('../../../../../infrasctucture/repositories/user-repository')
const { expect } = require('chai')
const mongoose = require('mongoose')

after(async () => {
  await mongoose.connection.db.dropDatabase()
})

describe('Integration | Infrastructure | Repository | UserRepository', async () => {
  const userAlreadyRegistered = new NewUser({
    email: 'knownUser@example.net',
    pseudo: 'knownUser',
    password: 'KnownUser123!'
  })

  const newUser = new NewUser({
    email: 'newUser@example.net',
    pseudo: 'newUser',
    password: 'newUser123!'
  })

  const registeredUser = new User({
    pseudo: userAlreadyRegistered.pseudo,
    email: userAlreadyRegistered.email,
    password: await userAlreadyRegistered.hashPassword()
  })

  beforeEach(async () => {
    await registeredUser.save()
  })
  describe('Integration | Infrastructure | Repository | UserRepository', () => {
    describe('#isUserKnowByEmail', () => {
      it('Should return true if the given email is already registered in DB', async () => {
        const result = await userRepository.isUserknownByEmail(registeredUser.email)
        expect(result).to.be.equal(true)
      })

      it('Should return false the given email is NOT already known in DB', async () => {
        const result = await userRepository.isUserknownByEmail(newUser.email)
        expect(result).to.be.equal(false)
      })
    })

    describe('#isUserKnowByPSeudo', () => {
      it('Should return true if the given pseudo is already registered in DB', async () => {
        const result = await userRepository.isUserknownByPseudo(registeredUser.pseudo)
        expect(result).to.be.equal(true)
      })

      it('Should return false the given pseudo is NOT already known in DB', async () => {
        const result = await userRepository.isUserknownByPseudo(newUser.pseudo)
        expect(result).to.be.equal(false)
      })
    })
    describe('#registerNewUSer', () => {
      it('Should store a new user in DB', async () => {
        const result = await userRepository.registerNewUSer(newUser)
        expect(result).to.be.an.instanceOf(ApiResponse)
        expect(result.statusCode).to.be.equal(200)
      })

      it('Should NOT store an already known user in DB', async () => {
        const result = await userRepository.registerNewUSer(userAlreadyRegistered)
        expect(result).to.be.an.instanceOf(ApiResponse)
        expect(result.statusCode).to.be.equal(403)
        expect(result.payload).to.be.equal('User already known')
      })
    })
  })
})
