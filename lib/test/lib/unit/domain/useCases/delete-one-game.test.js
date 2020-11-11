// Chai
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))
chai.use(require('chai-sorted'))
// Sinon
const sinon = require('sinon')
chai.use(require('sinon-chai'))
// Other
const deleteOneGame = require('../../../../../domain/useCases/delete-one-game')
const gameRepository = require('../../../../../infrasctucture/repositories/game-repository')
const { catchErr } = require('../../../../test-helpers')
const { NotFound } = require('../../../../../domain/models/errors')

describe('Unit | Api | UseCase | delete-one-game', () => {
  describe('#deleteOneGame', () => {
    beforeEach(() => {
      sinon.stub(gameRepository, 'getUserGames')
      sinon.stub(gameRepository, 'deleteGame')
    })

    afterEach(() => {
      sinon.restore()
    })

    it('should return delete game confirmation', async () => {
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

      const gamesData = [
        {
          blackPassCount: 0,
          whitePassCount: 0,
          _id: require('mongoose').Types.ObjectId(),
          blackPlayer: blackPlayerData._id,
          whitePlayer: whitePlayerData._id,
          currentPlayer: blackPlayerData._id,
          __v: 0
        },
        {
          blackPassCount: 0,
          whitePassCount: 0,
          _id: gameId,
          blackPlayer: blackPlayerData._id,
          whitePlayer: whitePlayerData._id,
          currentPlayer: blackPlayerData._id,
          __v: 0
        }
      ]

      gameRepository.getUserGames.resolves(gamesData)

      const expectedResult = {
        n: 1,
        ok: 1,
        deletedCount: 1
      }

      gameRepository.deleteGame.resolves(expectedResult)

      // when
      const promise = await deleteOneGame({
        gameId,
        userId: blackPlayerData._id,
        gameRepository
      })

      // then
      expect(promise).to.deep.equal(expectedResult)
    })

    it('should throw an error if user has no game', async () => {
      // given
      const unKnownUserId = 'unKnownUserId'
      const gameId = require('mongoose').Types.ObjectId()

      gameRepository.getUserGames.rejects(new NotFound())

      // when
      const promise = await catchErr(deleteOneGame)({
        gameId,
        userId: unKnownUserId,
        gameRepository
      })

      // then
      expect(promise).to.be.instanceOf(NotFound)
    })

    it('should throw an error if user has games but none matches gameId', async () => {
      // given
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

      const gamesData = [
        {
          blackPassCount: 0,
          whitePassCount: 0,
          _id: require('mongoose').Types.ObjectId(),
          blackPlayer: blackPlayerData._id,
          whitePlayer: whitePlayerData._id,
          currentPlayer: blackPlayerData._id,
          __v: 0
        },
        {
          blackPassCount: 0,
          whitePassCount: 0,
          _id: require('mongoose').Types.ObjectId(),
          blackPlayer: blackPlayerData._id,
          whitePlayer: whitePlayerData._id,
          currentPlayer: blackPlayerData._id,
          __v: 0
        }
      ]

      gameRepository.getUserGames.resolves(gamesData)

      // when
      const promise = await catchErr(deleteOneGame)({
        gameId,
        userId: blackPlayerData._id,
        gameRepository
      })

      // then
      expect(promise).to.be.instanceOf(NotFound)
    })
  })
})
