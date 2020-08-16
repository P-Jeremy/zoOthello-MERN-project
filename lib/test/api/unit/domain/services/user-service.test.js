// Chai
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))
chai.use(require('chai-sorted'))
// Sinon
const sinon = require('sinon')
chai.use(require('sinon-chai'))
// Other
const userRepository = require('../../../../../infrasctucture/repositories/user-repository')
const service = require('../../../../../domain/services/user-service')
const { KnownUserError } = require('../../../../../domain/models/errors')
const catchErr = require('../../../../test-helper')

describe('Unit | Api | Services | userService', () => {
  beforeEach(() => {
    sinon.stub(userRepository, 'isUserknownByEmail')
    sinon.stub(userRepository, 'isUserknownByPseudo')
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('#isUserAlreadyKnownByEmail', () => {
    it('should return false if email is  NOT already registered', async () => {
      // given
      const user = {
        email: 'tatayoyo@exaple.net',
        pseudo: 'Tatayoyo',
        password: 'Tatayoyo'
      }
      userRepository.isUserknownByEmail
        .withArgs(user.email)
        .resolves(false)

      // when
      const isUserAlreadyKnownByEmail = await service.isUserAlreadyKnownByEmail(
        user,
        userRepository
      )

      // then
      expect(isUserAlreadyKnownByEmail).to.be.equal(false)
    })

    it('should thwrow an error if email is already registered', async () => {
      // given
      const user = {
        email: 'tatayoyo@exaple.net',
        pseudo: 'Tatayoyo',
        password: 'Tatayoyo'
      }
      userRepository.isUserknownByEmail
        .withArgs(user.email)
        .resolves(true)

      // when
      const error = await catchErr(service.isUserAlreadyKnownByEmail)(
        user,
        userRepository
      )

      // then
      expect(error.message).to.be.equal('email already registered')
      expect(error).to.be.an.instanceOf(KnownUserError)
    })
  })

  describe('#isUserAlreadyKnownByPseudo', () => {
    it('should return false if pseudo is NOT already registered', async () => {
      // given
      const user = {
        email: 'tatayoyo@exaple.net',
        pseudo: 'Tatayoyo',
        password: 'Tatayoyo'
      }
      userRepository.isUserknownByPseudo
        .withArgs(user.pseudo)
        .resolves(false)

      // when
      const isUserAlreadyKnownByPseudo = await service.isUserAlreadyKnownByPseudo(
        user,
        userRepository
      )

      // then
      expect(isUserAlreadyKnownByPseudo).to.be.equal(false)
    })

    it('should thwrow an error if pseudo is already registered', async () => {
      // given
      const user = {
        email: 'tatayoyo@exaple.net',
        pseudo: 'Tatayoyo',
        password: 'Tatayoyo'
      }
      userRepository.isUserknownByPseudo
        .withArgs(user.pseudo)
        .resolves(true)

      // when
      const error = await catchErr(service.isUserAlreadyKnownByPseudo)(
        user,
        userRepository
      )

      // then
      expect(error.message).to.be.equal('pseudo already registered')
      expect(error).to.be.an.instanceOf(KnownUserError)
    })
  })
})
