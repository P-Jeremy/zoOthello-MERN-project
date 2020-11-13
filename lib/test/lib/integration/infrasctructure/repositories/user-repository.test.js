const User = require('../../../../../db/models/User')
const bcrypt = require('bcryptjs')
const NewUser = require('../../../../../domain/models/NewUser')
const userRepository = require('../../../../../infrasctucture/repositories/user-repository')
const { expect } = require('chai')
const { NotFound, UnauthorizedError } = require('../../../../../domain/models/errors')
const { catchErr, dropCollection } = require('../../../../test-helpers')
const ZoothelloUser = require('../../../../../domain/models/ZoothelloUser')

describe('Integration | Infrastructure | Repository | UserRepository', async function () {
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

  let registeredUserId
  let firstRegisteredUser
  let secondRegisteredUser
  before('USER REPO', async function () {
    firstRegisteredUser = new User({
      pseudo: firstUser.pseudo,
      email: firstUser.email,
      password: await bcrypt.hash(firstUser.password, 10)
    })

    secondRegisteredUser = new User({
      pseudo: SecondUser.pseudo,
      email: SecondUser.email,
      password: await bcrypt.hash(SecondUser.password, 10)
    })
    await firstRegisteredUser.save()
    await secondRegisteredUser.save()
  })

  after(async function () {
    await dropCollection(User)
  })

  describe('#isUserKnowByEmail', function () {
    it('Should return true if the given email is already registered in DB', async function () {
      // when
      const result = await userRepository.isUserknownByEmail(firstRegisteredUser.email)

      // then
      expect(result).to.be.equal(true)
    })

    it('Should return false the given email is NOT already known in DB', async function () {
      // when
      const result = await userRepository.isUserknownByEmail(thirdUser.email)

      // then
      expect(result).to.be.equal(false)
    })
  })

  describe('#isUserKnowByPSeudo', function () {
    it('Should return true if the given pseudo is already registered in DB', async function () {
      // when
      const result = await userRepository.isUserknownByPseudo(firstRegisteredUser.pseudo)

      // then
      expect(result).to.be.equal(true)
    })

    it('Should return false the given pseudo is NOT already known in DB', async function () {
      // when
      const result = await userRepository.isUserknownByPseudo(thirdUser.pseudo)

      // then
      expect(result).to.be.equal(false)
    })
  })
  describe('#registerNewUSer', function () {
    it('Should store a new user in DB', async function () {
      // given
      const userToSave = {
        pseudo: thirdUser.pseudo,
        email: thirdUser.email,
        password: await bcrypt.hash(thirdUser.password, 10)
      }
      // when
      const result = await userRepository.registerNewUSer(userToSave)
      registeredUserId = result.id

      // then
      expect(result).to.be.an.instanceOf(ZoothelloUser)
      expect(result.pseudo).to.be.equal(userToSave.pseudo)
    })

    it('Should NOT store an already known user in DB', async function () {
      // when
      const result = await userRepository.registerNewUSer(firstUser)

      // then
      expect(result).to.be.an.instanceOf(UnauthorizedError)
      expect(result.message).to.be.equal('User already known')
    })
  })

  describe('#searchUsersByRegex', function () {
    it('Should return an array of multiple users if searchInput match several users', async function () {
      // given
      const searchInput = 'known'

      // when
      const result = await userRepository.searchUsersByRegex(searchInput)

      // then
      expect(result.length).to.be.equal(2)
    })

    it('Should return an array 1 user if searchInput match one user', async function () {
      // given
      const searchInput = 'knownUser2'

      // when
      const result = await userRepository.searchUsersByRegex(searchInput)

      // then
      expect(result.length).to.be.equal(1)
    })

    it('Should throw a NotFound error with statusCode 404 if no user found', async function () {
      // given
      const searchInput = 'unKnownUser'

      // when
      const result = await catchErr(userRepository.searchUsersByRegex)(searchInput)

      // then
      expect(result).to.be.an.instanceOf(NotFound)
      expect(result.message).to.be.equal('Not found')
    })
  })

  describe('#getUserInfos', function () {
    it('Should return one user', async function () {
      // when
      const result = await userRepository.getUserInfos(registeredUserId)

      // then
      expect(result.pseudo).to.be.equal(thirdUser.pseudo)
    })

    it('Should throw a NotFound error if no user found', async function () {
      // given
      const wrongId = require('mongoose').Types.ObjectId()

      // when
      const result = await catchErr(userRepository.getUserInfos)(wrongId)

      // then
      expect(result).to.be.an.instanceOf(NotFound)
      expect(result.message).to.be.equal('Not found')
    })
  })

  describe('#signIn', function () {
    it('Should return signedIn user', async function () {
      // when
      const registeredUserTryingToSignIn = new ZoothelloUser({
        pseudo: thirdUser.pseudo,
        password: thirdUser.password
      })
      const result = await userRepository.signIn(registeredUserTryingToSignIn)

      // then
      expect(result).to.be.an.instanceOf(ZoothelloUser)
      expect(result).to.haveOwnProperty('id')
      expect(result).to.haveOwnProperty('pseudo')
      expect(result.pseudo).to.be.equal(thirdUser.pseudo)
    })

    it('Should throw an Unauthorized error if credentials do not match', async function () {
      // given
      const wrongCredentials = new ZoothelloUser({
        pseudo: thirdUser.pseudo,
        password: 'wrongPassword'
      })

      // when
      const result = await catchErr(userRepository.signIn)(wrongCredentials)

      // then
      expect(result).to.be.an.instanceOf(UnauthorizedError)
    })
  })
})
