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
const KnownUserError = require('../../../../../domain/models/errors')
const catchErr = require('../../../../test-helper')

describe('Unit | Api | Services | userService', () => {
  describe('#canUserRegisterByEmailOrPSeudo', () => {
    beforeEach(() => {
      sinon.stub(userRepository, 'isUserknownByEmail')
      sinon.stub(userRepository, 'isUserknownByPseudo')
    })

    afterEach(() => {
      sinon.restore()
    })

    it('should return true if email & pseudo are NOT already registered', async () => {
      // given
      const user = {
        email: 'tatayoyo@exaple.net',
        pseudo: 'Tatayoyo',
        password: 'Tatayoyo'
      }
      userRepository.isUserknownByEmail
        .withArgs(user.email)
        .resolves(false)
      userRepository.isUserknownByPseudo
        .withArgs(user.pseudo)
        .resolves(false)

      // when
      const canUserRegisterByEmailOrPSeudo = await service.canUserRegisterByEmailOrPSeudo(
        user,
        userRepository
      )

      // then
      expect(canUserRegisterByEmailOrPSeudo).to.be.equal(true)
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
      userRepository.isUserknownByPseudo
        .withArgs(user.pseudo)
        .resolves(false)

      // when
      const error = await catchErr(service.canUserRegisterByEmailOrPSeudo)(
        user,
        userRepository
      )

      // then
      expect(error.message).to.be.equal('email already registered')
      expect(error).to.be.an.instanceOf(KnownUserError)
    })
    it('should thwrow an error if pseudo is already registered', async () => {
      // given
      const user = {
        email: 'tatayoyo@exaple.net',
        pseudo: 'Tatayoyo',
        password: 'Tatayoyo'
      }
      userRepository.isUserknownByEmail
        .withArgs(user.email)
        .resolves(false)
      userRepository.isUserknownByPseudo
        .withArgs(user.pseudo)
        .resolves(true)

      // when
      const error = await catchErr(service.canUserRegisterByEmailOrPSeudo)(
        user,
        userRepository
      )

      // then
      expect(error.message).to.be.equal('pseudo already registered')
      expect(error).to.be.an.instanceOf(KnownUserError)
    })
  })
})
