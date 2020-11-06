// Chai
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))
chai.use(require('chai-sorted'))
// Sinon
const sinon = require('sinon')
chai.use(require('sinon-chai'))
// Other
const resetGame = require('../../../../../domain/useCases/reset-game')
const { Game } = require('reversi')
const gameRepository = require('../../../../../infrasctucture/repositories/game-repository')
const gameService = require('../../../../../infrasctucture/services/game-service')
const catchErr = require('../../../../test-helper')
const { NotFound } = require('../../../../../domain/models/errors')

describe('Unit | Api | UseCase | reset-game', () => {
  describe('#resetGame', () => {
    beforeEach(() => {
      sinon.stub(gameRepository, 'getGameDatas')
      sinon.stub(gameRepository, 'resetGame')
    })

    afterEach(() => {
      sinon.restore()
    })

    it('should return a reseted game', async () => {
      // given
      const gameId = require('mongoose').Types.ObjectId()
      const whitePlayerData = {
        pseudo: 'whitePlayer',
        _id: require('mongoose').Types.ObjectId()
      }

      const blackPlayerData = {
        pseudo: 'blackPlayer',
        _id: require('mongoose').Types.ObjectId()
      }

      const gameData = {
        blackPassCount: 1,
        whitePassCount: 1,
        _id: require('mongoose').Types.ObjectId(),
        blackPlayer: blackPlayerData._id,
        whitePlayer: whitePlayerData._id,
        currentPlayer: blackPlayerData._id,
        __v: 0
      }

      gameRepository.getGameDatas.resolves(gameData)

      const resetedGame = {
        blackPassCount: 0,
        whitePassCount: 0,
        game: gameService.newGame(),
        _id: require('mongoose').Types.ObjectId(),
        blackPlayer: blackPlayerData._id,
        whitePlayer: whitePlayerData._id,
        currentPlayer: blackPlayerData._id,
        __v: 0
      }

      gameRepository.resetGame.resolves(resetedGame)

      // when
      const promise = await resetGame({
        gameId,
        gameRepository,
        gameService
      })

      // then
      expect(promise).to.deep.equal(resetedGame)
      expect(promise.game).to.be.instanceOf(Game)
      expect(promise.blackPassCount).to.equal(0)
      expect(promise.whitePassCount).to.equal(0)
    })

    it('should throw an error if game is not found', async () => {
      // given
      const gameId = require('mongoose').Types.ObjectId()

      gameRepository.getGameDatas.rejects(new NotFound())

      // when
      const promise = await catchErr(resetGame)({
        gameId,
        gameRepository,
        gameService
      })

      // then
      expect(promise).to.be.instanceOf(NotFound)
    })
  })
})
