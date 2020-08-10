import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Board from './Board'
import reversi from 'reversi'

const GameGameInstance = reversi.Game
const game = new GameGameInstance()

let wrapper
const handleClick = jest.fn()
beforeEach(() => {
  wrapper = render(
    <Board board={game._board} click={handleClick}/>
  )
})

describe('Board', () => {
  it('Basic rendering', () => {
    const { asFragment } = wrapper
    expect(asFragment()).toMatchSnapshot()
  })

  it('Board has 8 Rows', () => {
    const { queryAllByTestId } = wrapper
    const rows = queryAllByTestId('row')
    expect(rows).toHaveLength(8)
  })

  it('Board has 64 squares', () => {
    const { queryAllByTestId } = wrapper
    const squares = queryAllByTestId('square')
    expect(squares).toHaveLength(64)
  })

  it('Board has 2 black pawns', () => {
    const { queryAllByTestId } = wrapper
    const redDucks = queryAllByTestId('test-pawn-red')
    expect(redDucks).toHaveLength(2)
  })

  it('Board has 2 white pawns', () => {
    const { queryAllByTestId } = wrapper
    const yellowDucks = queryAllByTestId('test-pawn-yellow')
    expect(yellowDucks).toHaveLength(2)
  })
})
