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
const catchErr = require('../../../../test-helper')
const { NotFound } = require('../../../../../domain/models/errors')
const ApiResponse = require('../../../../../domain/models/ApiResponse')

describe('Unit | Api | UseCase | get-user-infos', () => {
  describe('#getUserInfos', () => {
    beforeEach(() => {
      sinon.stub(userRepository, 'getUserInfos')
    })

    afterEach(() => {
      sinon.restore()
    })

    it('should return an ApiResponse', async () => {
      // given
      const userId = require('mongoose').Types.ObjectId()
      const foudUser = new ApiResponse({
        statusCode: 200,
        payload: {
          pseudo: 'foundUser',
          email: 'foundUser@example.net'
        }
      })
      userRepository.getUserInfos.resolves(foudUser)

      // when
      const promise = await getUserInfos({
        userId,
        userRepository
      })

      // then
      expect(promise).to.be.equal(foudUser)
      expect(promise).to.be.an.instanceOf(ApiResponse)
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
