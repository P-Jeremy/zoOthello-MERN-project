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

describe('Unit | Api | UseCase | register-new-user', () => {
  let userRepository

  beforeEach(() => {
    userRepository = { isUserUnknown: sinon.stub() }
  })

  afterEach(() => {
    sinon.restore()
  })

  it('should resolve when user is not already in db', () => {
    // given
    const user = {
      email: 'tatayoyo@exaple.net',
      pseudo: 'Tatayoyo',
      password: 'Tatayoyo'
    }

    // when
    const promise = registerNewUser({
      user,
      userRepository
    })
    userRepository.isUserUnknown.resolves(true)

    // then
    return expect(promise).to.be.fulfilled
  })
})
