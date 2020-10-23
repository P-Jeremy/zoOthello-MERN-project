// Chai
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))
chai.use(require('chai-sorted'))
// Sinon
const sinon = require('sinon')
chai.use(require('sinon-chai'))
// Other
const getAllGames = require('../../../../../domain/useCases/get-all-games')
const gameRepository = require('../../../../../infrasctucture/repositories/game-repository')
const catchErr = require('../../../../test-helper')
const { NotFound } = require('../../../../../domain/models/errors')

describe('Unit | Api | UseCase | get-all-games', () => {
  describe('#getAllGames', () => {
    beforeEach(() => {
      sinon.stub(gameRepository, 'getAllGames')
    })

    afterEach(() => {
      sinon.restore()
    })

    it('should return a list of game', async () => {
      // given
      const foundGamesInRepo = [
        {
          blackPassCount: 0,
          whitePassCount: 0,
          _id: require('mongoose').Types.ObjectId(),
          blackPlayer: require('mongoose').Types.ObjectId(),
          whitePlayer: require('mongoose').Types.ObjectId(),
          currentPlayer: require('mongoose').Types.ObjectId(),
          __v: 0
        },
        {
          blackPassCount: 0,
          whitePassCount: 0,
          _id: require('mongoose').Types.ObjectId(),
          blackPlayer: require('mongoose').Types.ObjectId(),
          whitePlayer: require('mongoose').Types.ObjectId(),
          currentPlayer: require('mongoose').Types.ObjectId(),
          __v: 0
        },
        {
          blackPassCount: 0,
          whitePassCount: 0,
          _id: require('mongoose').Types.ObjectId(),
          blackPlayer: require('mongoose').Types.ObjectId(),
          whitePlayer: require('mongoose').Types.ObjectId(),
          currentPlayer: require('mongoose').Types.ObjectId(),
          __v: 0
        }
      ]

      gameRepository.getAllGames.resolves(foundGamesInRepo)

      // when
      const result = await getAllGames({
        gameRepository
      })

      // then
      expect(result).to.deep.equal(foundGamesInRepo)
    })

    it('should return a NotFound error if no games are found', async () => {
      // given
      gameRepository.getAllGames.throws(new NotFound())

      // when
      const error = await catchErr(getAllGames)({ gameRepository })

      // then
      expect(error).to.be.an.instanceOf(NotFound)
    })
  })
})
