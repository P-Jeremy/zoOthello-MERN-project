const User = require('../../../../../db/models/User')
const ApiResponse = require('../../../../../domain/models/ApiResponse')
const NewUser = require('../../../../../domain/models/NewUser')
const userRepository = require('../../../../../infrasctucture/repositories/user-repository')
const { expect } = require('chai')
const mongoose = require('mongoose')
const NotFound = require('../../../../../domain/models/NotFound')
const catchErr = require('../../../../test-helper')

after(async () => {
  await mongoose.connection.db.dropDatabase()
})

describe('Integration | Infrastructure | Repository | UserRepository', async () => {
  const firstUserAlreadyRegistered = new NewUser({
    email: 'knownUser@example.net',
    pseudo: 'knownUser',
    password: 'KnownUser123!'
  })

  const SecondUserAlreadyRegistered = new NewUser({
    email: 'knownUser2@example.net',
    pseudo: 'knownUser2',
    password: 'KnownUser123!'
  })

  const newUser = new NewUser({
    email: 'newUser@example.net',
    pseudo: 'newUser',
    password: 'newUser123!'
  })

  const firstRegisteredUser = new User({
    pseudo: firstUserAlreadyRegistered.pseudo,
    email: firstUserAlreadyRegistered.email,
    password: await firstUserAlreadyRegistered.hashPassword()
  })

  const secondRegisteredUser = new User({
    pseudo: SecondUserAlreadyRegistered.pseudo,
    email: SecondUserAlreadyRegistered.email,
    password: await SecondUserAlreadyRegistered.hashPassword()
  })

  beforeEach(async () => {
    await firstRegisteredUser.save()
    await secondRegisteredUser.save()
  })
  describe('Integration | Infrastructure | Repository | UserRepository', () => {
    describe('#isUserKnowByEmail', () => {
      it('Should return true if the given email is already registered in DB', async () => {
        const result = await userRepository.isUserknownByEmail(firstRegisteredUser.email)
        expect(result).to.be.equal(true)
      })

      it('Should return false the given email is NOT already known in DB', async () => {
        const result = await userRepository.isUserknownByEmail(newUser.email)
        expect(result).to.be.equal(false)
      })
    })

    describe('#isUserKnowByPSeudo', () => {
      it('Should return true if the given pseudo is already registered in DB', async () => {
        const result = await userRepository.isUserknownByPseudo(firstRegisteredUser.pseudo)
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
        const result = await userRepository.registerNewUSer(firstUserAlreadyRegistered)
        expect(result).to.be.an.instanceOf(ApiResponse)
        expect(result.statusCode).to.be.equal(403)
        expect(result.payload).to.be.equal('User already known')
      })
    })

    describe('#searchUsersByRegex', () => {
      it('Should return an array of multiple users if searchInput match several users', async () => {
        const searchInput = 'known'
        const result = await userRepository.searchUsersByRegex(searchInput)
        expect(result).to.be.an.instanceOf(ApiResponse)
        expect(result.payload.length).to.be.equal(2)
        expect(result.statusCode).to.be.equal(200)
      })

      it('Should return an array 1 user if searchInput match one user', async () => {
        const searchInput = 'knownUser2'
        const result = await userRepository.searchUsersByRegex(searchInput)
        expect(result).to.be.an.instanceOf(ApiResponse)
        expect(result.payload.length).to.be.equal(1)
        expect(result.statusCode).to.be.equal(200)
      })

      it('Should throw a NotFound error with statusCode 404 if no user found', async () => {
        const searchInput = 'tatayoyo'
        const result = await catchErr(userRepository.searchUsersByRegex)(searchInput)
        expect(result).to.be.an.instanceOf(NotFound)
        expect(result.message).to.be.equal('Not found')
        expect(result.statusCode).to.be.equal(404)
      })
    })
  })
})
