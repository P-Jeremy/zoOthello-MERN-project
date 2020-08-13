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
const KnownUserError = require('../../../../../domain/models/errors')

describe('Unit | Api | UseCase | register-new-user', () => {
  beforeEach(() => {
    sinon.stub(userRepository, 'isUserUnknown')
    sinon.stub(userRepository, 'registerNewUSer')
  })

  afterEach(() => {
    sinon.restore()
  })

  it('should reject when user is already in registered db', async () => {
    // given
    const user = {
      email: 'tatayoyo@exaple.net',
      pseudo: 'Tatayoyo',
      password: 'Tatayoyo'
    }
    const error = new KnownUserError()
    userRepository.isUserUnknown
      .withArgs(user)
      .rejects(error)

    // when
    const promise = registerNewUser({
      user,
      userRepository
    })

    // then
    return expect(promise).to.have.been.rejectedWith(KnownUserError)
  })

  it('should resolve when user is NOT already in registered db', async () => {
    // given
    const user = {
      email: 'tatayoyo@exaple.net',
      pseudo: 'Tatayoyo',
      password: 'Tatayoyo'
    }
    userRepository.isUserUnknown
      .withArgs(user)
      .resolves(true)

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
