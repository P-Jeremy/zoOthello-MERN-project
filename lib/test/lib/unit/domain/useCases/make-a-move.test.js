// Chai
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))
chai.use(require('chai-sorted'))
// Sinon
const sinon = require('sinon')
chai.use(require('sinon-chai'))
// Other
const makeAMove = require('../../../../../domain/useCases/make-a-move')
const { Game } = require('reversi')
const gameRepository = require('../../../../../infrasctucture/repositories/game-repository')
const userRepository = require('../../../../../infrasctucture/repositories/user-repository')
const gameService = require('../../../../../domain/services/game-service')
const { UnauthorizedError } = require('../../../../../domain/models/errors')
const { catchErr } = require('../../../../test-helpers')

describe('Unit | Api | UseCase | make-a-move', () => {
  describe('#makeAMove', () => {
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

    const gameDataBeforeValidMove = {
      blackPassCount: 0,
      whitePassCount: 0,
      _id: require('mongoose').Types.ObjectId(),
      game: new Game(),
      blackPlayer: blackPlayerData._id,
      whitePlayer: whitePlayerData._id,
      currentPlayer: blackPlayerData._id,
      score: null,
      __v: 0
    }

    beforeEach(() => {
      sinon.stub(gameRepository, 'getGameDatas')
      sinon.stub(gameRepository, 'updateGame')
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

    it('should return an updated game after a valid move', async () => {
      // given
      const coordinates = {
        x: 3,
        y: 2
      }
      const gameInstanceForMoveMaking = new Game()
      gameInstanceForMoveMaking.proceed(coordinates.x, coordinates.y)
      const gameInstanceUPdatedAfterAValidMove = { ...gameInstanceForMoveMaking }

      gameRepository.getGameDatas.resolves(gameDataBeforeValidMove)
      userRepository.getUserInfos.resolves(blackPlayerData)

      const updatedGameDataAfterValidMove = {
        blackPassCount: 0,
        whitePassCount: 0,
        game: gameInstanceUPdatedAfterAValidMove,
        _id: gameDataBeforeValidMove._id,
        blackPlayer: blackPlayerData._id,
        whitePlayer: whitePlayerData._id,
        currentPlayer: whitePlayerData._id,
        score: {
          BLACK: 4,
          BLANK: 59,
          WHITE: 1
        },
        __v: 0
      }

      gameRepository.updateGame.resolves(updatedGameDataAfterValidMove)

      // when
      const promise = await makeAMove({
        gameId,
        coordinates,
        gameRepository,
        gameService,
        socketio,
        userId: blackPlayerData._id,
        userRepository
      })

      // then
      sinon.assert.calledWith(socketio.sockets.emit, 'gameUpdated', {
        origin: 'move',
        player: blackPlayerData.pseudo,
        newMove: true,
        id: gameDataBeforeValidMove._id
      })

      expect(promise).to.deep.equal(updatedGameDataAfterValidMove)
      expect(promise).to.not.deep.equal(gameDataBeforeValidMove)
      expect(promise.currentPlayer).to.equal(whitePlayerData._id)
      expect(promise.score.BLACK).to.equal(4)
      expect(promise.score.WHITE).to.equal(1)
    })

    it('should throw an error if user is not the current player', async () => {
      // given
      const coordinates = {
        x: 3,
        y: 2
      }
      const gameInstanceForMoveMaking = new Game()
      gameInstanceForMoveMaking.proceed(coordinates.x, coordinates.y)

      gameRepository.getGameDatas.resolves(gameDataBeforeValidMove)
      userRepository.getUserInfos.resolves(whitePlayerData)

      // when
      const promise = await catchErr(makeAMove)({
        gameId,
        coordinates,
        gameRepository,
        gameService,
        socketio,
        userId: whitePlayerData._id,
        userRepository
      })

      expect(promise).to.be.instanceOf(UnauthorizedError)
    })

    it('should throw an error on invalid move', async () => {
    // given
      const coordinates = {
        x: 2,
        y: 2
      }
      const gameInstanceForMoveMaking = new Game()
      gameInstanceForMoveMaking.proceed(coordinates.x, coordinates.y)

      gameRepository.getGameDatas.resolves(gameDataBeforeValidMove)
      userRepository.getUserInfos.resolves(blackPlayerData)

      // when
      const promise = await catchErr(makeAMove)({
        gameId,
        coordinates,
        gameRepository,
        gameService,
        socketio,
        userId: blackPlayerData._id,
        userRepository
      })

      expect(promise).to.be.instanceOf(UnauthorizedError)
    })
  })
})
