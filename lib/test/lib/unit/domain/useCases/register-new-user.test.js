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
const { KnownUserError } = require('../../../../../domain/models/errors')
const { catchErr } = require('../../../../test-helpers')

describe('Unit | Api | UseCase | register-new-user', () => {
  describe('#registerNewUser', () => {
    beforeEach(() => {
      sinon.stub(userRepository, 'registerNewUSer')
      sinon.stub(userRepository, 'isUserknownByPseudo')
      sinon.stub(userRepository, 'isUserknownByEmail')
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
      userRepository.isUserknownByEmail.resolves(true)

      // when
      const promise = await catchErr(registerNewUser)({
        user,
        userRepository
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
      userRepository.isUserknownByPseudo.resolves(true)

      // when
      const promise = await catchErr(registerNewUser)({
        user,
        userRepository
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
      userRepository.isUserknownByPseudo.resolves(false)

      userRepository.isUserknownByEmail.resolves(false)

      // when
      const promise = registerNewUser({
        user,
        userRepository
      })

      // then
      expect(promise).not.to.have.been.rejectedWith(KnownUserError)
      return promise.should.be.fulfilled
    })
  })
})
