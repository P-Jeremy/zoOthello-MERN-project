import 'jsdom-global/register'
import React from 'react'
import TestRenderer from 'react-test-renderer'
import { configure, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Board from './Board'
import reversi from 'reversi'

const GameGameInstance = reversi.Game
const game = new GameGameInstance()

configure({ adapter: new Adapter() })

let renderer
const handleClick = jest.fn()
beforeEach(() => {
  renderer = mount(
    <Board board={game._board} click={handleClick}/>
  )
})

describe('Board', () => {
  it('Basic rendering', () => {
    const renderer = TestRenderer.create(
      <Board board={game._board} click={handleClick}/>
    )
    const result = renderer.toJSON()
    expect(result).toMatchSnapshot()
  })

  it('Board has 8 Rows', () => {
    expect(renderer.find('.row')).toHaveLength(8)
  })

  it('Board has 64 Squares', () => {
    expect(renderer.find('.square')).toHaveLength(64)
  })

  it('Board has 2 black pawns', () => {
    expect(renderer.find('.red')).toHaveLength(2)
  })

  it('Board has 2 white pawns', () => {
    expect(renderer.find('.yellow')).toHaveLength(2)
  })
})
