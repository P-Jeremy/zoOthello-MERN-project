import 'jsdom-global/register'
import React from 'react'
import TestRenderer from 'react-test-renderer'
import { configure, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Row from './Row'
import reversi from 'reversi'

const GameGameInstance = reversi.Game
const game = new GameGameInstance()

configure({ adapter: new Adapter() })

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
let renderer
beforeEach(() => {
  renderer = mount(
    <Row
      col={col}
      click={click} />
  )
})

describe('Row', () => {
  it('Basic rendering', () => {
    const renderer = TestRenderer.create(
      <Row click={click} col={col}/>)
    const result = renderer.toJSON()
    expect(result).toMatchSnapshot()
  })

  it('Rendering after black move', () => {
    const renderer = TestRenderer.create(
      <Row click={click} col={colAfterBlackMove}/>)
    const result = renderer.toJSON()
    expect(result).toMatchSnapshot()
  })

  it('should render two black pawns after move', () => {
    renderer.setProps({ col: colAfterBlackMove })
    expect(renderer.find('.black')).toHaveLength(2)
  })
})
