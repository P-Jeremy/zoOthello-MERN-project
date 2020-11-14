// Chai
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))
chai.use(require('chai-sorted'))
// Sinon
const sinon = require('sinon')
chai.use(require('sinon-chai'))
// Other
const createGame = require('../../../../../domain/useCases/create-game')
const gameService = require('../../../../../domain/services/game-service')
const gameRepository = require('../../../../../infrasctucture/repositories/game-repository')
const userRepository = require('../../../../../infrasctucture/repositories/user-repository')
const { catchErr } = require('../../../../test-helpers')
const { NotFound } = require('../../../../../domain/models/errors')

describe('Unit | Api | UseCase | create-game', () => {
  describe('#createGame', () => {
    beforeEach(() => {
      sinon.stub(gameRepository, 'addGame')
      sinon.stub(userRepository, 'getUserInfos')
    })

    afterEach(() => {
      sinon.restore()
    })

    it('should return a new game', async () => {
      // given
      const blackPlayer = require('mongoose').Types.ObjectId()
      const whitePlayer = require('mongoose').Types.ObjectId()
      const createdGame = {
        blackPassCount: 0,
        whitePassCount: 0,
        _id: require('mongoose').Types.ObjectId(),
        blackPlayer,
        whitePlayer,
        currentPlayer: blackPlayer,
        __v: 0
      }

      userRepository.getUserInfos.onCall(0).resolves(blackPlayer)
      userRepository.getUserInfos.onCall(1).resolves(whitePlayer)

      gameRepository.addGame.resolves(createdGame)

      // when
      const result = await createGame({
        gameRepository,
        userRepository,
        gameService,
        blackPlayer,
        whitePlayer
      })

      // then
      expect(result).to.deep.equal(createdGame)
    })

    it('should return a NotFound error if the blackPlayer does not exist', async () => {
      // given
      const blackPlayer = require('mongoose').Types.ObjectId()
      const whitePlayer = require('mongoose').Types.ObjectId()

      userRepository.getUserInfos.onCall(0).rejects(new NotFound())
      userRepository.getUserInfos.onCall(1).resolves(whitePlayer)
      // when
      const error = await catchErr(createGame)({
        gameRepository,
        userRepository,
        gameService,
        blackPlayer,
        whitePlayer
      })

      // then
      expect(error).to.be.an.instanceOf(NotFound)
    })

    it('should return a NotFound error if the whitePlayer does not exist', async () => {
      // given
      const blackPlayer = require('mongoose').Types.ObjectId()
      const whitePlayer = require('mongoose').Types.ObjectId()

      userRepository.getUserInfos.onCall(1).resolves(blackPlayer)
      userRepository.getUserInfos.onCall(0).rejects(new NotFound())
      // when
      const error = await catchErr(createGame)({
        gameRepository,
        userRepository,
        gameService,
        blackPlayer,
        whitePlayer
      })

      // then
      expect(error).to.be.an.instanceOf(NotFound)
    })
  })
})
