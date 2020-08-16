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

describe('Unit | Api | UseCase | register-new-user', () => {
  describe('#registerNewUser', () => {
    beforeEach(() => {
      sinon.stub(userRepository, 'registerNewUSer')
      sinon.stub(userService, 'canUserRegisterByEmailOrPSeudo')
    })

    afterEach(() => {
      sinon.restore()
    })

    it('should reject email or pseudo are already registered', () => {
      // given
      const user = {
        email: 'tatayoyo@exaple.net',
        pseudo: 'Tatayoyo',
        password: 'Tatayoyo'
      }
      const error = new KnownUserError()
      userService.canUserRegisterByEmailOrPSeudo.throws(error)

      // when
      const promise = registerNewUser({
        user,
        userRepository,
        userService
      })

      // then
      return expect(promise).to.have.been.rejectedWith(KnownUserError)
    })

    it('should resolve when email or pseudo are NOT already in registered db', async () => {
      // given
      const user = {
        email: 'tatayoyo@exaple.net',
        pseudo: 'Tatayoyo',
        password: 'Tatayoyo'
      }
      userService.canUserRegisterByEmailOrPSeudo
        .withArgs(user, userRepository)
        .resolves(true)

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
