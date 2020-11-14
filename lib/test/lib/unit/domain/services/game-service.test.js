const { expect } = require('chai')
const { Game } = require('reversi')
const gameService = require('../../../../../domain/services/game-service')

describe('Unit | domain | services | game-service', () => {
  describe('#getOppositePieceType', () => {
    it('Should return "WHITE"', () => {
      // when
      const newType = gameService.getOppositePieceType('BLACK')

      // then
      expect(newType).to.equal('WHITE')
    })
    it('Should return "BLACK"', () => {
      // when
      const newType = gameService.getOppositePieceType('WHITE')

      // then
      expect(newType).to.equal('BLACK')
    })
  })

  describe('#hasAlreadyPassedOnce', () => {
    it('Should return true if count is > 0', () => {
      // given
      const count = 1
      // when
      const hasAlreadyPassedOnce = gameService.hasAlreadyPassedOnce(count)

      // then
      expect(hasAlreadyPassedOnce).to.equal(true)
    })

    it('Should return false if count is = 0', () => {
      // given
      const count = 0
      // when
      const hasAlreadyPassedOnce = gameService.hasAlreadyPassedOnce(count)

      // then
      expect(hasAlreadyPassedOnce).to.equal(false)
    })
  })

  describe('#isUserBlackPlayer', () => {
    it('Should return true if userId equal blackPlayerId', () => {
      // given
      const userId = 'someId'
      const blackPlayerId = 'someId'
      // when
      const isUserBlackPlayer = gameService.isUserBlackPlayer(userId, blackPlayerId)

      // then
      expect(isUserBlackPlayer).to.equal(true)
    })

    it('Should return false if userId does not equal blackPlayerId', () => {
      // given
      const userId = 'someId'
      const blackPlayerId = 'differentId'
      // when
      const isUserBlackPlayer = gameService.isUserBlackPlayer(userId, blackPlayerId)

      // then
      expect(isUserBlackPlayer).to.equal(false)
    })
  })

  describe('#isUserWhitePlayer', () => {
    it('Should return true if userId equal WhitePlayerId', () => {
      // given
      const userId = 'someId'
      const WhitePlayerId = 'someId'
      // when
      const isUserWhitePlayer = gameService.isUserWhitePlayer(userId, WhitePlayerId)

      // then
      expect(isUserWhitePlayer).to.equal(true)
    })

    it('Should return false if userId does not equal WhitePlayerId', () => {
      // given
      const userId = 'someId'
      const WhitePlayerId = 'differentId'
      // when
      const isUserWhitePlayer = gameService.isUserWhitePlayer(userId, WhitePlayerId)

      // then
      expect(isUserWhitePlayer).to.equal(false)
    })
  })

  describe('#isUserAllowedToPlay', () => {
    describe('Current piece type is BLACK', () => {
      it('Should return true if userId matches the blackPlayerid', () => {
        // given
        const userId = 'blackPlayerId'
        const gameData = {
          whitePlayer: 'whitePlayerId',
          blackPlayer: 'blackPlayerId'
        }
        const currentPieceType = 'BLACK'

        // when
        const isUserAllowedToPlay = gameService.isUserAllowedToPlay(gameData, currentPieceType, userId)

        // then
        expect(isUserAllowedToPlay).to.equal(true)
      })

      it('Should return false if userId matches the whitePlayerId', () => {
        // given
        const userId = 'whitePlayerId'
        const gameData = {
          whitePlayer: 'whitePlayerId',
          blackPlayer: 'blackPlayerId'
        }
        const currentPieceType = 'BLACK'

        // when
        const isUserAllowedToPlay = gameService.isUserAllowedToPlay(gameData, currentPieceType, userId)

        // then
        expect(isUserAllowedToPlay).to.equal(false)
      })
    })

    describe('Current piece type is WHITE', () => {
      it('Should return true if userId matches the whitePlayerId', () => {
        // given
        const userId = 'whitePlayerId'
        const gameData = {
          whitePlayer: 'whitePlayerId',
          blackPlayer: 'blackPlayerId'
        }
        const currentPieceType = 'WHITE'

        // when
        const isUserAllowedToPlay = gameService.isUserAllowedToPlay(gameData, currentPieceType, userId)

        // then
        expect(isUserAllowedToPlay).to.equal(true)
      })

      it('Should return false if userId matches the blackPlayer', () => {
        // given
        const userId = 'blackPlayerId'
        const gameData = {
          whitePlayer: 'whitePlayerId',
          blackPlayer: 'blackPlayerId'
        }
        const currentPieceType = 'WHITE'

        // when
        const isUserAllowedToPlay = gameService.isUserAllowedToPlay(gameData, currentPieceType, userId)

        // then
        expect(isUserAllowedToPlay).to.equal(false)
      })
    })
  })

  describe('#newGame', () => {
    it('Should return a new Game instance', () => {
      // given
      const expectedResult = new Game()

      // when
      const newGame = gameService.newGame()

      // then
      expect(newGame).to.be.instanceOf(Game)
      expect(newGame).to.deep.equal(expectedResult)
    })
  })
})
