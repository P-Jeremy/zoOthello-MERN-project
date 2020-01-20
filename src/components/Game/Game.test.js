import 'jsdom-global/register'
import React from 'react'
import TestRenderer from 'react-test-renderer'
import Game from './Game'
import reversi from 'reversi'

const GameGameInstance = reversi.Game
const game = new GameGameInstance()

const state = {
  id: 'sdlké&1212',
  game: game,
  nextPlayer: game._nextPieceType,
  score: null,
  blackPassCount: 0,
  whitePassCount: 0
}

let renderer
let instance
beforeEach(() => {
  renderer = TestRenderer.create(
    <Game/>
  )
  instance = renderer.root.instance
  TestRenderer.act(() => {
    instance.setState(
      {
        id: state.id,
        game: state.game,
        nextPlayer: game._nextPieceType,
        score: game._board.countByPieceType(),
        blackPassCount: state.blackPassCount,
        whitePassCount: state.whitePassCount
      }
    )
  })
})

describe('Game', () => {
  it('Basic rendering', () => {
    const result = renderer.toJSON()
    expect(result).toMatchSnapshot()
  })

  it('Doesn\'t change player after an illegal click', () => {
    instance.handleClick(3, 3)
    expect(instance.state.nextPlayer).toBe('BLACK')
  })

  it('Changes player after a legal click', () => {
    instance.handleClick(2, 3)
    expect(instance.state.nextPlayer).toBe('WHITE')
  })

  it('Changes initial score after a legal click', () => {
    TestRenderer.act(() => {
      instance.handleClick(2, 3)
    })
    expect(instance.state.score.BLACK).toBe(4)
  })
})
