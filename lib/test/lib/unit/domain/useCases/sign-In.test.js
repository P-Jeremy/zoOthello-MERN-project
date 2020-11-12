// Chai
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))
chai.use(require('chai-sorted'))
// Sinon
const sinon = require('sinon')
chai.use(require('sinon-chai'))
// Other
const signIn = require('../../../../../domain/useCases/sign-in')
const userRepository = require('../../../../../infrasctucture/repositories/user-repository')
const { catchErr } = require('../../../../test-helpers')
const { NotFound, UnauthorizedError } = require('../../../../../domain/models/errors')

describe('Unit | Api | UseCase | sign-in', () => {
  describe('#signIn', () => {
    beforeEach(() => {
      sinon.stub(userRepository, 'isUserknownByPseudo')
      sinon.stub(userRepository, 'signIn')
    })

    afterEach(() => {
      sinon.restore()
    })

    it('should return a user', async () => {
      // given
      const user = {
        pseudo: 'registeredUser',
        email: 'registeredUser@example.net'
      }
      const signedInUser = {
        pseudo: 'registeredUser',
        email: 'registeredUser@example.net'
      }

      userRepository.isUserknownByPseudo.resolves(true)
      userRepository.signIn.resolves(signedInUser)

      // when
      const promise = await signIn({
        user,
        userRepository
      })

      // then
      expect(promise).to.be.equal(signedInUser)
    })

    it('should return a NotFound error if a user is notFound by pseudo', async () => {
      // given
      const user = {
        pseudo: 'unknownUser',
        email: 'inknownUser@example.net',
        password: '213215'
      }
      userRepository.isUserknownByPseudo.throws(new NotFound())

      // when
      const promise = await catchErr(signIn)({
        user,
        userRepository
      })

      // then
      expect(promise).to.be.an.instanceOf(NotFound)
    })
    it('should return a NotFound error if a user gives the wrong credentials', async () => {
      // given
      const user = {
        pseudo: 'unknownUser',
        email: 'inknownUser@example.net',
        password: '9878787'
      }
      userRepository.isUserknownByPseudo.resolves(true)
      userRepository.signIn.throws(new UnauthorizedError())

      // when
      const promise = await catchErr(signIn)({
        user,
        userRepository
      })

      // then
      expect(promise).to.be.an.instanceOf(UnauthorizedError)
    })
  })
})
