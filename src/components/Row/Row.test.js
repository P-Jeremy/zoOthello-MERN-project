import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Row from './Row'
import reversi from 'reversi'

const GameInstance = reversi.Game
const game = new GameInstance()

const col = game._board._squares[4]
const colAfterBlackMove = [
  { _pieceType: 'BLANK', _rowIndex: 4, _colIndex: 0 },
  { _pieceType: 'BLANK', _rowIndex: 4, _colIndex: 1 },
  { _pieceType: 'BLANK', _rowIndex: 4, _colIndex: 2 },
  { _pieceType: 'BLACK', _rowIndex: 4, _colIndex: 3 },
  { _pieceType: 'WHITE', _rowIndex: 4, _colIndex: 4 },
  { _pieceType: 'BLACK', _rowIndex: 4, _colIndex: 5 },
  { _pieceType: 'BLANK', _rowIndex: 4, _colIndex: 6 },
  { _pieceType: 'BLANK', _rowIndex: 4, _colIndex: 7 }
]

const click = jest.fn()
let wrapper
beforeEach(() => {
  wrapper = render(
    <Row
      col={col}
      click={click} />
  )
})

describe('Row', () => {
  it('Basic rendering', () => {
    const { asFragment } = wrapper
    expect(asFragment()).toMatchSnapshot()
  })

  it('should render two red ducks after move', () => {
    const { queryAllByTestId, rerender } = wrapper
    let initialBlackPawns = queryAllByTestId('test-pawn-red')
    let initialWhitePawns = queryAllByTestId('test-pawn-yellow')
    expect(initialBlackPawns).toHaveLength(1)
    expect(initialWhitePawns).toHaveLength(1)

    rerender(<Row col={colAfterBlackMove} />)

    initialBlackPawns = queryAllByTestId('test-pawn-red')
    initialWhitePawns = queryAllByTestId('test-pawn-yellow')
    expect(initialBlackPawns).toHaveLength(2)
    expect(initialWhitePawns).toHaveLength(1)
  })
})
