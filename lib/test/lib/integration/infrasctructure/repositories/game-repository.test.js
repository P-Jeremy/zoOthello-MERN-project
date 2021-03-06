const Game = require('../../../../../db/models/Game')
const gameRepository = require('../../../../../infrasctucture/repositories/game-repository')
const { expect } = require('chai')
const { catchErr, dropCollection } = require('../../../../test-helpers')
const { NotFound, UnauthorizedError } = require('../../../../../domain/models/errors')

describe('Integration | Infrastructure | Repository | GameRepository', async function () {
  afterEach('GAME REPO', async function () {
    await dropCollection(Game)
  })

  describe('#addGame', function () {
    it('Should return a saved game', async function () {
      // given
      const blackPlayer = require('mongoose').Types.ObjectId()
      const whitePlayer = require('mongoose').Types.ObjectId()
      const game = new Game({
        blackPassCount: 0,
        whitePassCount: 0,
        game: Symbol('game'),
        blackPlayer,
        whitePlayer,
        currentPlayer: whitePlayer
      })

      // when
      const result = await gameRepository.addGame(game)

      // then
      expect(result).to.be.instanceOf(Game)
      expect(result.blackPassCount).to.equal(0)
      expect(result.whitePassCount).to.equal(0)
      expect(String(result.currentPlayer)).to.equal(String(whitePlayer))
      expect(String(result.whitePlayer)).to.equal(String(whitePlayer))
      expect(String(result.blackPlayer)).to.equal(String(blackPlayer))
    })

    it('Should throw an error if game can not be saved', async function () {
      // given
      const blackPlayer = require('mongoose').Types.ObjectId()
      const whitePlayer = require('mongoose').Types.ObjectId()
      const game = {
        blackPassCount: 0,
        whitePassCount: 0,
        game: Symbol('game'),
        blackPlayer,
        whitePlayer,
        currentPlayer: whitePlayer
      }

      // when
      const result = await catchErr(gameRepository.addGame)(game)

      // then
      expect(result).to.be.instanceOf(UnauthorizedError)
    })
  })

  describe('#getAllGames', () => {
    it('Should throw a not found error if no games are stored in DB', async function () {
      // when
      const result = await catchErr(gameRepository.getAllGames)()

      // then
      expect(result).to.be.instanceOf(NotFound)
    })

    it('Should return all games stored in DB', async function () {
    // given
      const firstGame = new Game({
        blackPassCount: 0,
        whitePassCount: 0,
        game: {},
        blackPlayer: require('mongoose').Types.ObjectId(),
        whitePlayer: require('mongoose').Types.ObjectId(),
        currentPlayer: require('mongoose').Types.ObjectId()
      })

      const secondGame = new Game({
        blackPassCount: 0,
        whitePassCount: 0,
        game: {},
        blackPlayer: require('mongoose').Types.ObjectId(),
        whitePlayer: require('mongoose').Types.ObjectId(),
        currentPlayer: require('mongoose').Types.ObjectId()
      })

      const thirdGame = new Game({
        blackPassCount: 0,
        whitePassCount: 0,
        game: {},
        blackPlayer: require('mongoose').Types.ObjectId(),
        whitePlayer: require('mongoose').Types.ObjectId(),
        currentPlayer: require('mongoose').Types.ObjectId()
      })

      await firstGame.save()
      await secondGame.save()
      await thirdGame.save()

      // when
      const result = await gameRepository.getAllGames()

      // then
      result.map((game) => expect(game).to.be.instanceOf(Game))
      expect(result.length).to.be.equal(3)
    })
  })

  describe('#getUserGames', () => {
    it('Should return all games related to a specific user stored in DB', async function () {
      // given
      const userId = require('mongoose').Types.ObjectId()

      const firstGame = new Game({
        blackPassCount: 0,
        whitePassCount: 0,
        game: {},
        blackPlayer: userId,
        whitePlayer: require('mongoose').Types.ObjectId(),
        currentPlayer: userId
      })

      const secondGame = new Game({
        blackPassCount: 0,
        whitePassCount: 0,
        game: {},
        blackPlayer: require('mongoose').Types.ObjectId(),
        whitePlayer: userId,
        currentPlayer: userId
      })

      const thirdGame = new Game({
        blackPassCount: 0,
        whitePassCount: 0,
        game: {},
        blackPlayer: require('mongoose').Types.ObjectId(),
        whitePlayer: require('mongoose').Types.ObjectId(),
        currentPlayer: require('mongoose').Types.ObjectId()
      })

      await firstGame.save()
      await secondGame.save()
      await thirdGame.save()

      // when
      const result = await gameRepository.getUserGames(userId)

      // then
      result.map((game) => expect(game).to.be.instanceOf(Game))
      expect(result.length).to.be.equal(2)
    })
  })

  describe('#getGameData', function () {
    it('Should return one game datas', async function () {
      // given
      const firstGame = new Game({
        blackPassCount: 0,
        whitePassCount: 0,
        game: {},
        blackPlayer: require('mongoose').Types.ObjectId(),
        whitePlayer: require('mongoose').Types.ObjectId(),
        currentPlayer: require('mongoose').Types.ObjectId()
      })

      const secondGame = new Game({
        blackPassCount: 0,
        whitePassCount: 0,
        game: {},
        blackPlayer: require('mongoose').Types.ObjectId(),
        whitePlayer: require('mongoose').Types.ObjectId(),
        currentPlayer: require('mongoose').Types.ObjectId()
      })

      await firstGame.save()
      const savedGame = await secondGame.save()

      // when
      const result = await gameRepository.getGameDatas(savedGame._id)

      // then
      expect(result).to.be.instanceOf(Game)
      expect(String(result._id)).to.equal(String(savedGame._id))
    })
  })

  describe('#resetGame', function () {
    it('Should return one reseted game datas', async () => {
      // given
      const blackPlayer = require('mongoose').Types.ObjectId()
      const whitePlayer = require('mongoose').Types.ObjectId()
      const game = new Game({
        blackPassCount: 1,
        whitePassCount: 1,
        game: Symbol('game'),
        blackPlayer,
        whitePlayer,
        currentPlayer: require('mongoose').Types.ObjectId()
      })

      const savedGame = await game.save()

      // when
      const result = await gameRepository.resetGame({
        gameId: savedGame._id,
        newGame: Symbol('game'),
        currentPlayer: blackPlayer
      })

      // then
      expect(result).to.be.instanceOf(Game)
      expect(result.blackPassCount).to.equal(0)
      expect(result.whitePassCount).to.equal(0)
      expect(String(result.currentPlayer)).to.equal(String(blackPlayer))
      expect(String(result._id)).to.equal(String(savedGame._id))
    })

    it('Should throw an error if no game found', async function () {
      // given
      const blackPlayer = require('mongoose').Types.ObjectId()
      const whitePlayer = require('mongoose').Types.ObjectId()
      const game = new Game({
        blackPassCount: 1,
        whitePassCount: 1,
        game: Symbol('game'),
        blackPlayer,
        whitePlayer,
        currentPlayer: require('mongoose').Types.ObjectId()
      })

      await game.save()

      // when
      const wrongId = require('mongoose').Types.ObjectId()
      const result = await catchErr(gameRepository.resetGame)({
        gameId: wrongId,
        newGame: Symbol('game'),
        currentPlayer: blackPlayer
      })

      // then
      expect(result).to.be.instanceOf(NotFound)
    })
  })

  describe('#updateGame', function () {
    it('Should return one updated game after a passed turn', async () => {
      // given
      const blackPlayer = require('mongoose').Types.ObjectId()
      const whitePlayer = require('mongoose').Types.ObjectId()
      const game = new Game({
        blackPassCount: 0,
        whitePassCount: 0,
        game: Symbol('game'),
        blackPlayer,
        whitePlayer,
        currentPlayer: require('mongoose').Types.ObjectId()
      })

      const savedGame = await game.save()

      // when
      const result = await gameRepository.updateGame({
        gameId: savedGame._id,
        game: Symbol('game'),
        whitePassCount: 0,
        blackPassCount: 1,
        currentPlayer: whitePlayer
      })

      // then
      expect(result).to.be.instanceOf(Game)
      expect(result.blackPassCount).to.equal(1)
      expect(result.whitePassCount).to.equal(0)
      expect(String(result.currentPlayer)).to.equal(String(whitePlayer))
      expect(String(result._id)).to.equal(String(savedGame._id))
    })

    it('Should throw an error if no game found', async function () {
      // given
      const blackPlayer = require('mongoose').Types.ObjectId()
      const whitePlayer = require('mongoose').Types.ObjectId()
      const game = new Game({
        blackPassCount: 1,
        whitePassCount: 1,
        game: Symbol('game'),
        blackPlayer,
        whitePlayer,
        currentPlayer: require('mongoose').Types.ObjectId()
      })

      await game.save()

      // when
      const wrongId = require('mongoose').Types.ObjectId()
      const result = await catchErr(gameRepository.resetGame)({
        gameId: wrongId,
        newGame: Symbol('game'),
        currentPlayer: blackPlayer
      })

      // then
      expect(result).to.be.instanceOf(NotFound)
    })
  })

  describe('#deleteGame', () => {
    it('Should delete a game', async function () {
      // given
      const blackPlayer = require('mongoose').Types.ObjectId()
      const whitePlayer = require('mongoose').Types.ObjectId()
      const game = new Game({
        blackPassCount: 1,
        whitePassCount: 1,
        game: Symbol('game'),
        blackPlayer,
        whitePlayer,
        currentPlayer: require('mongoose').Types.ObjectId()
      })

      const savedGame = await game.save()

      // when
      const result = await gameRepository.deleteGame({
        gameId: savedGame._id
      })

      // then
      expect(result.deletedCount).to.equal(1)
    })

    it('Should throw an error if no game found', async function () {
      // when
      const result = await catchErr(gameRepository.deleteGame)({
        gameId: require('mongoose').Types.ObjectId()
      })

      // then
      expect(result).to.be.instanceOf(NotFound)
    })
  })
})
