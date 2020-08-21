const User = require('../../../../../db/models/User')
const ApiResponse = require('../../../../../domain/models/ApiResponse')
const NewUser = require('../../../../../domain/models/NewUser')
const userRepository = require('../../../../../infrasctucture/repositories/user-repository')
const { expect } = require('chai')
const mongoose = require('mongoose')
const { NotFound, UnauthorizedError } = require('../../../../../domain/models/errors')
const catchErr = require('../../../../test-helper')
const ZoothelloUser = require('../../../../../domain/models/ZoothelloUser')

after(async () => {
  await mongoose.connection.db.dropDatabase()
})

describe('Integration | Infrastructure | Repository | UserRepository', async () => {
  const firstUser = new NewUser({
    email: 'knownUser@example.net',
    pseudo: 'knownUser',
    password: 'KnownUser123!'
  })

  const SecondUser = new NewUser({
    email: 'knownUser2@example.net',
    pseudo: 'knownUser2',
    password: 'KnownUser123!'
  })

  const thirdUser = new NewUser({
    email: 'newUser@example.net',
    pseudo: 'newUser',
    password: 'newUser123!'
  })

  const firstRegisteredUser = new User({
    pseudo: firstUser.pseudo,
    email: firstUser.email,
    password: await firstUser.hashPassword()
  })

  const secondRegisteredUser = new User({
    pseudo: SecondUser.pseudo,
    email: SecondUser.email,
    password: await SecondUser.hashPassword()
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
        const result = await userRepository.isUserknownByEmail(thirdUser.email)

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
        const result = await userRepository.isUserknownByPseudo(thirdUser.pseudo)

        // then
        expect(result).to.be.equal(false)
      })
    })
    describe('#registerNewUSer', () => {
      it('Should store a new user in DB', async () => {
        // when
        const result = await userRepository.registerNewUSer(thirdUser)
        registeredUserId = result.payload._id

        // then
        expect(result).to.be.an.instanceOf(ApiResponse)
        expect(result.statusCode).to.be.equal(200)
      })

      it('Should NOT store an already known user in DB', async () => {
        // when
        const result = await userRepository.registerNewUSer(firstUser)

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
        expect(result.payload.pseudo).to.be.equal(thirdUser.pseudo)
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

    describe('#signIn', () => {
      it('Should return signedIn user', async () => {
        // when
        const registeredUserTryingToSignIn = new ZoothelloUser({
          pseudo: thirdUser.pseudo,
          password: thirdUser.password
        })
        const result = await userRepository.signIn(registeredUserTryingToSignIn)

        // then
        expect(result).to.be.an.instanceOf(ApiResponse)
        expect(result.payload.pseudo).to.be.equal(thirdUser.pseudo)
        expect(result.statusCode).to.be.equal(200)
      })

      it('Should throw an Unauthorized error if credentials do not match', async () => {
        // given
        const wrongCredentials = new ZoothelloUser({
          pseudo: thirdUser.pseudo,
          password: 'wrongPassword'
        })

        // when
        const result = await catchErr(userRepository.signIn)(wrongCredentials)

        // then
        expect(result).to.be.an.instanceOf(UnauthorizedError)
        expect(result.statusCode).to.be.equal(403)
      })
    })
  })
})
