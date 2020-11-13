// Chai
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))
chai.use(require('chai-sorted'))
// Sinon
const sinon = require('sinon')
chai.use(require('sinon-chai'))
// Other
const getUserInfos = require('../../../../../domain/useCases/get-user-infos')
const userRepository = require('../../../../../infrasctucture/repositories/user-repository')
const { catchErr } = require('../../../../test-helpers')
const { NotFound } = require('../../../../../domain/models/errors')

describe('Unit | Api | UseCase | get-user-infos', () => {
  describe('#getUserInfos', () => {
    beforeEach(() => {
      sinon.stub(userRepository, 'getUserInfos')
    })

    afterEach(() => {
      sinon.restore()
    })

    it('should return a user', async () => {
      // given
      const userId = require('mongoose').Types.ObjectId()
      const foudUser = {
        pseudo: 'foundUser',
        email: 'foundUser@example.net'
      }
      userRepository.getUserInfos.resolves(foudUser)

      // when
      const promise = await getUserInfos({
        userId,
        userRepository
      })

      // then
      expect(promise).to.be.equal(foudUser)
    })

    it('should return a NotFound error if a user is notFound', async () => {
      // given
      const userId = require('mongoose').Types.ObjectId()
      userRepository.getUserInfos.throws(new NotFound())

      // when
      const promise = await catchErr(getUserInfos)({
        userId,
        userRepository
      })

      // then
      expect(promise).to.be.an.instanceOf(NotFound)
    })
  })
})
