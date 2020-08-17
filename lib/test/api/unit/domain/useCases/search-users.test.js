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
const searchUsers = require('../../../../../domain/useCases/search-users')

describe('Unit | Api | UseCase | search-users', () => {
  describe('#searchUsers', () => {
    beforeEach(() => {
      sinon.stub(userRepository, 'searchUsersByRegex')
    })

    afterEach(() => {
      sinon.restore()
    })

    it('should resolves if repo returns an array', () => {
      // given
      const searchInput = 'Known'
      userRepository.searchUsersByRegex.resolves({ statusCode: 200, payload: ['user1', 'user2'] })

      // when
      const promise = searchUsers({
        searchInput,
        userRepository
      })

      // then
      return expect(promise).to.have.been.fulfilled
    })
  })
})
