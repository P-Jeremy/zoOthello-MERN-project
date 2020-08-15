const User = require('../../../../../db/models/User')
// const ApiResponse = require('../../../../../domain/models/apiResponse')
const NewUser = require('../../../../../domain/models/NewUser')
const userRepository = require('../../../../../infrasctucture/repositories/user-repository')
const { expect } = require('chai')
const mongoose = require('mongoose')

after(async () => {
  await mongoose.connection.db.dropDatabase()
})

describe('Integration | Infrastructure | Repository | UserRepository', async () => {
  const userAlreadyRegister = new NewUser({
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
    pseudo: userAlreadyRegister.pseudo,
    email: userAlreadyRegister.email,
    password: await userAlreadyRegister.hashPassword()
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
  })
})
