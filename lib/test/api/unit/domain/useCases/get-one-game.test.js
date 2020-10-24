// Chai
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))
chai.use(require('chai-sorted'))
// Sinon
const sinon = require('sinon')
chai.use(require('sinon-chai'))
// Other
const getOneGame = require('../../../../../domain/useCases/get-one-game')
const userRepository = require('../../../../../infrasctucture/repositories/user-repository')
const gameRepository = require('../../../../../infrasctucture/repositories/game-repository')
const catchErr = require('../../../../test-helper')
const { NotFound } = require('../../../../../domain/models/errors')

describe('Unit | Api | UseCase | get-one-game', () => {
  describe('#getOneGame', () => {
    beforeEach(() => {
      sinon.stub(userRepository, 'getUserInfos')
      sinon.stub(gameRepository, 'getGameDatas')
    })

    afterEach(() => {
      sinon.restore()
    })

    it('should return all game infos', async () => {
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
        blackPassCount: 0,
        whitePassCount: 0,
        _id: require('mongoose').Types.ObjectId(),
        blackPlayer: blackPlayerData._id,
        whitePlayer: whitePlayerData._id,
        currentPlayer: blackPlayerData._id,
        __v: 0
      }

      userRepository.getUserInfos.onCall(0).resolves(whitePlayerData)
      userRepository.getUserInfos.onCall(1).resolves(blackPlayerData)
      gameRepository.getGameDatas.resolves(gameData)

      const expectedResult = {
        gameData,
        whitePlayerData,
        blackPlayerData
      }

      // when
      const promise = await getOneGame({
        gameId,
        userRepository,
        gameRepository
      })

      // then
      expect(promise).to.deep.equal(expectedResult)
    })

    it('should throw an error if game is not found', async () => {
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

      gameRepository.getGameDatas.rejects(new NotFound())
      userRepository.getUserInfos.onCall(0).resolves(whitePlayerData)
      userRepository.getUserInfos.onCall(1).resolves(blackPlayerData)

      // when
      const promise = await catchErr(getOneGame)({
        gameId,
        userRepository,
        gameRepository
      })

      // then
      expect(promise).to.be.instanceOf(NotFound)
    })

    it('should throw an error if whitePlayer is not found', async () => {
      // given
      const gameId = require('mongoose').Types.ObjectId()

      const blackPlayerData = {
        pseudo: 'blackPlayer',
        _id: require('mongoose').Types.ObjectId()
      }

      const gameData = {
        blackPassCount: 0,
        whitePassCount: 0,
        _id: require('mongoose').Types.ObjectId(),
        blackPlayer: blackPlayerData._id,
        whitePlayer: require('mongoose').Types.ObjectId(),
        currentPlayer: blackPlayerData._id,
        __v: 0
      }

      gameRepository.getGameDatas.resolves(gameData)
      userRepository.getUserInfos.onCall(0).rejects(new NotFound())
      userRepository.getUserInfos.onCall(1).resolves(blackPlayerData)

      // when
      const promise = await catchErr(getOneGame)({
        gameId,
        userRepository,
        gameRepository
      })

      // then
      expect(promise).to.be.instanceOf(NotFound)
    })

    it('should throw an error if blackPlayer is not found', async () => {
      // given
      const gameId = require('mongoose').Types.ObjectId()

      const whitePlayerData = {
        pseudo: 'blackPlayer',
        _id: require('mongoose').Types.ObjectId()
      }

      const gameData = {
        blackPassCount: 0,
        whitePassCount: 0,
        _id: require('mongoose').Types.ObjectId(),
        whitePlayer: whitePlayerData._id,
        blackPlayer: require('mongoose').Types.ObjectId(),
        currentPlayer: whitePlayerData._id,
        __v: 0
      }

      gameRepository.getGameDatas.resolves(gameData)
      userRepository.getUserInfos.onCall(0).rejects(new NotFound())
      userRepository.getUserInfos.onCall(1).resolves(whitePlayerData)

      // when
      const promise = await catchErr(getOneGame)({
        gameId,
        userRepository,
        gameRepository
      })

      // then
      expect(promise).to.be.instanceOf(NotFound)
    })
  })
})
