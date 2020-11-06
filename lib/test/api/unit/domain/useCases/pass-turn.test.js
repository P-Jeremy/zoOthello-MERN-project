// Chai
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))
chai.use(require('chai-sorted'))
// Sinon
const sinon = require('sinon')
chai.use(require('sinon-chai'))
// Other
const passTurn = require('../../../../../domain/useCases/pass-turn')
const { Game } = require('reversi')
const gameRepository = require('../../../../../infrasctucture/repositories/game-repository')
const userRepository = require('../../../../../infrasctucture/repositories/user-repository')
const gameService = require('../../../../../infrasctucture/services/game-service')
const catchErr = require('../../../../test-helper')
const { NotFound, UnauthorizedError } = require('../../../../../domain/models/errors')

describe('Unit | Api | UseCase | pass-turn', () => {
  describe('#passTurn', () => {
    let socketio
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
      game: {
        _nextPieceType: 'WHITE'
      },
      blackPlayer: blackPlayerData._id,
      whitePlayer: whitePlayerData._id,
      currentPlayer: whitePlayerData._id,
      __v: 0
    }

    beforeEach(() => {
      sinon.stub(gameRepository, 'getGameDatas')
      sinon.stub(gameRepository, 'updateGame')
      sinon.stub(gameRepository, 'resetGame')
      sinon.stub(userRepository, 'getUserInfos')
      socketio = {
        sockets: {
          emit: sinon.stub()
        }
      }
    })

    afterEach(() => {
      sinon.restore()
    })

    it('should return an blackPassCount updated game', async () => {
      // given
      gameRepository.getGameDatas.resolves(gameData)
      userRepository.getUserInfos.resolves(whitePlayerData)

      const updatedGame = {
        blackPassCount: 0,
        whitePassCount: 1,
        game: {
          _nextPieceType: 'BLACK'
        },
        _id: require('mongoose').Types.ObjectId(),
        blackPlayer: blackPlayerData._id,
        whitePlayer: whitePlayerData._id,
        currentPlayer: blackPlayerData._id,
        __v: 0
      }

      gameRepository.updateGame.resolves(updatedGame)

      // when
      const promise = await passTurn({
        gameId,
        gameRepository,
        gameService,
        socketio,
        userId: whitePlayerData._id,
        userRepository
      })

      // then
      sinon.assert.calledWith(socketio.sockets.emit, 'gameUpdated', {
        origin: 'pass',
        player: whitePlayerData.pseudo,
        newMove: false,
        id: updatedGame._id
      })

      expect(promise).to.deep.equal(updatedGame)
      expect(promise.blackPassCount).to.equal(0)
      expect(promise.whitePassCount).to.equal(1)
    })

    it('should reset game if user has already passed once', async () => {
      // given
      gameData.whitePassCount = 1

      gameRepository.getGameDatas.resolves(gameData)
      userRepository.getUserInfos.resolves(whitePlayerData)

      const resetedGame = {
        blackPassCount: 0,
        whitePassCount: 0,
        game: new Game(),
        _id: require('mongoose').Types.ObjectId(),
        blackPlayer: blackPlayerData._id,
        whitePlayer: whitePlayerData._id,
        currentPlayer: blackPlayerData._id,
        __v: 0
      }

      gameRepository.resetGame.resolves(resetedGame)

      // when
      const promise = await passTurn({
        gameId,
        gameRepository,
        gameService,
        socketio,
        userId: whitePlayerData._id,
        userRepository
      })

      // then
      sinon.assert.calledWith(socketio.sockets.emit, 'gameUpdated', {
        origin: 'hasPassedTwice',
        player: whitePlayerData.pseudo,
        newMove: false,
        id: gameData._id
      })

      expect(promise).to.deep.equal(resetedGame)
      expect(promise.blackPassCount).to.equal(0)
      expect(promise.whitePassCount).to.equal(0)
    })

    it('should throw an error if user is not allowed to play', async () => {
      // given
      gameRepository.getGameDatas.resolves(gameData)
      userRepository.getUserInfos.resolves(blackPlayerData)

      // when
      const promise = await catchErr(passTurn)({
        gameId,
        gameRepository,
        gameService,
        socketio,
        userId: blackPlayerData._id,
        userRepository
      })

      // then
      expect(promise).to.be.instanceOf(UnauthorizedError)
    })

    it('should throw an error if game is not found', async () => {
      // given
      const wrongGameId = require('mongoose').Types.ObjectId()

      gameRepository.getGameDatas.rejects(new NotFound())

      // when
      const promise = await catchErr(passTurn)({
        gameId: wrongGameId,
        gameRepository,
        gameService,
        socketio,
        userId: blackPlayerData._id,
        userRepository
      })

      // then
      expect(promise).to.be.instanceOf(NotFound)
    })
  })
})
