const { expect } = require('chai')
const { Game } = require('reversi')
const gameService = require('../../../../../infrasctucture/services/game-service')

describe('Unit | infrastructure | services | game-service', () => {
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
