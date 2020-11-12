// Chai
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))
chai.use(require('chai-sorted'))
// Sinon
const sinon = require('sinon')
chai.use(require('sinon-chai'))
// Other
const getUserGames = require('../../../../../domain/useCases/get-user-games')
const gameRepository = require('../../../../../infrasctucture/repositories/game-repository')
const { catchErr } = require('../../../../test-helpers')
const { NotFound } = require('../../../../../domain/models/errors')

describe('Unit | Api | UseCase | get-user-games', () => {
  describe('#getUserGames', () => {
    beforeEach(() => {
      sinon.stub(gameRepository, 'getUserGames')
    })

    afterEach(() => {
      sinon.restore()
    })

    it('should return a list of game related to the given userId', async () => {
      // given
      const userId = require('mongoose').Types.ObjectId()
      const foundGamesInRepo = [
        {
          blackPassCount: 0,
          whitePassCount: 0,
          _id: require('mongoose').Types.ObjectId(),
          blackPlayer: userId,
          whitePlayer: require('mongoose').Types.ObjectId(),
          currentPlayer: require('mongoose').Types.ObjectId(),
          __v: 0
        },
        {
          blackPassCount: 0,
          whitePassCount: 0,
          _id: require('mongoose').Types.ObjectId(),
          blackPlayer: require('mongoose').Types.ObjectId(),
          whitePlayer: userId,
          currentPlayer: require('mongoose').Types.ObjectId(),
          __v: 0
        }
      ]

      gameRepository.getUserGames.resolves(foundGamesInRepo)

      // when
      const result = await getUserGames({
        userId,
        gameRepository
      })

      // then
      expect(result).to.deep.equal(foundGamesInRepo)
    })

    it('should return a NotFound error if no games are found', async () => {
      // given
      const userId = require('mongoose').Types.ObjectId()
      gameRepository.getUserGames.throws(new NotFound())

      // when
      const error = await catchErr(getUserGames)({ userId, gameRepository })

      // then
      expect(error).to.be.an.instanceOf(NotFound)
    })
  })
})
