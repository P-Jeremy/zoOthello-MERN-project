// Chai
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))
chai.use(require('chai-sorted'))
// Sinon
const sinon = require('sinon')
chai.use(require('sinon-chai'))
// Other
const registerNewUser = require('../../../../../domain/useCases/register-new-user')
const userRepository = require('../../../../../infrasctucture/repositories/user-repository')
const userService = require('../../../../../domain/services/user-service')
const { KnownUserError } = require('../../../../../domain/models/errors')
const catchErr = require('../../../../test-helper')

describe('Unit | Api | UseCase | register-new-user', () => {
  describe('#registerNewUser', () => {
    beforeEach(() => {
      sinon.stub(userRepository, 'registerNewUSer')
      sinon.stub(userService, 'isUserAlreadyKnownByPseudo')
      sinon.stub(userService, 'isUserAlreadyKnownByEmail')
    })

    afterEach(() => {
      sinon.restore()
    })

    it('should reject if email already registered', async () => {
      // given
      const user = {
        email: 'tatayoyo@exaple.net',
        pseudo: 'Tatayoyo',
        password: 'Tatayoyo'
      }
      const error = new KnownUserError('email already registered')
      userService.isUserAlreadyKnownByEmail.throws(error)

      // when
      const promise = await catchErr(registerNewUser)({
        user,
        userRepository,
        userService
      })

      // then
      expect(promise).to.be.an.instanceOf(KnownUserError)
    })

    it('should reject if pseudo already registered', async () => {
      // given
      const user = {
        email: 'tatayoyo@exaple.net',
        pseudo: 'Tatayoyo',
        password: 'Tatayoyo'
      }
      const error = new KnownUserError('pseudo already registered')
      userService.isUserAlreadyKnownByPseudo.throws(error)

      // when
      const promise = await catchErr(registerNewUser)({
        user,
        userRepository,
        userService
      })

      // then
      expect(promise).to.be.an.instanceOf(KnownUserError)
    })

    it('should resolve when email and pseudo are NOT already in registered db', async () => {
      // given
      const user = {
        email: 'tatayoyo@exaple.net',
        pseudo: 'Tatayoyo',
        password: 'Tatayoyo'
      }
      userService.isUserAlreadyKnownByEmail
        .withArgs(user, userRepository)
        .resolves(false)

      userService.isUserAlreadyKnownByEmail
        .withArgs(user, userRepository)
        .resolves(false)

      // when
      const promise = registerNewUser({
        user,
        userRepository,
        userService
      })

      // then
      expect(promise).not.to.have.been.rejectedWith(KnownUserError)
      return promise.should.be.fulfilled
    })
  })
})
