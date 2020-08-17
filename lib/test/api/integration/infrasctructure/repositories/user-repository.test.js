const User = require('../../../../../db/models/User')
const ApiResponse = require('../../../../../domain/models/ApiResponse')
const UserModel = require('../../../../../domain/models/User')
const userRepository = require('../../../../../infrasctucture/repositories/user-repository')
const { expect } = require('chai')
const mongoose = require('mongoose')
const { NotFound } = require('../../../../../domain/models/errors')
const catchErr = require('../../../../test-helper')

after(async () => {
  await mongoose.connection.db.dropDatabase()
})

describe('Integration | Infrastructure | Repository | UserRepository', async () => {
  const firstUserAlreadyRegistered = new UserModel({
    email: 'knownUser@example.net',
    pseudo: 'knownUser',
    password: 'KnownUser123!'
  })

  const SecondUserAlreadyRegistered = new UserModel({
    email: 'knownUser2@example.net',
    pseudo: 'knownUser2',
    password: 'KnownUser123!'
  })

  const userNotYetRegistered = new UserModel({
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

  let registeredUserId

  beforeEach(async () => {
    await firstRegisteredUser.save()
    await secondRegisteredUser.save()
  })
  describe('Integration | Infrastructure | Repository | UserRepository', () => {
    describe('#isUserKnowByEmail', () => {
      it('Should return true if the given email is already registered in DB', async () => {
        // when
        const result = await userRepository.isUserknownByEmail(firstRegisteredUser.email)

        // then
        expect(result).to.be.equal(true)
      })

      it('Should return false the given email is NOT already known in DB', async () => {
        // when
        const result = await userRepository.isUserknownByEmail(userNotYetRegistered.email)

        // then
        expect(result).to.be.equal(false)
      })
    })

    describe('#isUserKnowByPSeudo', () => {
      it('Should return true if the given pseudo is already registered in DB', async () => {
        // when
        const result = await userRepository.isUserknownByPseudo(firstRegisteredUser.pseudo)

        // then
        expect(result).to.be.equal(true)
      })

      it('Should return false the given pseudo is NOT already known in DB', async () => {
        // when
        const result = await userRepository.isUserknownByPseudo(userNotYetRegistered.pseudo)

        // then
        expect(result).to.be.equal(false)
      })
    })
    describe('#registerNewUSer', () => {
      it('Should store a new user in DB', async () => {
        // when
        const result = await userRepository.registerNewUSer(userNotYetRegistered)
        registeredUserId = result.payload._id

        // then
        expect(result).to.be.an.instanceOf(ApiResponse)
        expect(result.statusCode).to.be.equal(200)
      })

      it('Should NOT store an already known user in DB', async () => {
        // when
        const result = await userRepository.registerNewUSer(firstUserAlreadyRegistered)

        // then
        expect(result).to.be.an.instanceOf(ApiResponse)
        expect(result.statusCode).to.be.equal(403)
        expect(result.payload).to.be.equal('User already known')
      })
    })

    describe('#searchUsersByRegex', () => {
      it('Should return an array of multiple users if searchInput match several users', async () => {
        // given
        const searchInput = 'known'

        // when
        const result = await userRepository.searchUsersByRegex(searchInput)

        // then
        expect(result).to.be.an.instanceOf(ApiResponse)
        expect(result.payload.length).to.be.equal(2)
        expect(result.statusCode).to.be.equal(200)
      })

      it('Should return an array 1 user if searchInput match one user', async () => {
        // given
        const searchInput = 'knownUser2'

        // when
        const result = await userRepository.searchUsersByRegex(searchInput)

        // then
        expect(result).to.be.an.instanceOf(ApiResponse)
        expect(result.payload.length).to.be.equal(1)
        expect(result.statusCode).to.be.equal(200)
      })

      it('Should throw a NotFound error with statusCode 404 if no user found', async () => {
        // given
        const searchInput = 'unKnownUser'

        // when
        const result = await catchErr(userRepository.searchUsersByRegex)(searchInput)

        // then
        expect(result).to.be.an.instanceOf(NotFound)
        expect(result.message).to.be.equal('Not found')
        expect(result.statusCode).to.be.equal(404)
      })
    })

    describe('#getUserInfos', () => {
      it('Should return one user', async () => {
        // when
        const result = await userRepository.getUserInfos(registeredUserId)

        // then
        expect(result).to.be.an.instanceOf(ApiResponse)
        expect(result.payload.pseudo).to.be.equal(userNotYetRegistered.pseudo)
        expect(result.statusCode).to.be.equal(200)
      })

      it('Should throw a NotFound error if no user found', async () => {
        // given
        const wrongId = require('mongoose').Types.ObjectId()

        // when
        const result = await catchErr(userRepository.getUserInfos)(wrongId)

        // then
        expect(result).to.be.an.instanceOf(NotFound)
        expect(result.message).to.be.equal('Not found')
        expect(result.statusCode).to.be.equal(404)
      })
    })
  })
})
