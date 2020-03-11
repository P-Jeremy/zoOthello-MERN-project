import React from 'react'
import { render } from '@testing-library/react'
import { LocalStorageMock } from '@react-mock/localstorage'
import { StateMock } from '@react-mock/state'
import '@testing-library/jest-dom/extend-expect'
import HomeIn from './HomeIn'
import reversi from 'reversi'

const GameInstance = reversi.Game
const game = new GameInstance()

const mockGames = [
  {
    _id: 'firstMok',
    blackPassCount: 0,
    whitePassCount: 0,
    game: game,
    blackPlayer: '1234',
    whitePlayer: '5678',
    currentPlayer: '1234'
  },
  {
    _id: 'secondMok',
    blackPassCount: 0,
    whitePassCount: 0,
    game: game,
    blackPlayer: '1234',
    whitePlayer: '5678',
    currentPlayer: '1234'
  },
  {
    _id: 'thirdMok',
    blackPassCount: 0,
    whitePassCount: 0,
    game: game,
    blackPlayer: '1234',
    whitePlayer: '5678',
    currentPlayer: '1234'
  }
]

let wrapper
beforeEach(() => {
  wrapper = render(
    <LocalStorageMock items={{ userId: '1234', loggedIn: true }}>
      <HomeIn/>
    </LocalStorageMock>
  )
})

describe('HomIn', () => {
  it('Should render as many listItem as in the games state Array', async () => {
    const { queryAllByTestId, rerender } = wrapper
    rerender(
      <StateMock state={{ games: mockGames }}>
        <HomeIn/>
      </StateMock>
    )
    expect(queryAllByTestId('listItem')).toHaveLength(mockGames.length)
  })

  it('Should render the searchBar Component', async () => {
    const { queryAllByTestId } = wrapper
    expect(queryAllByTestId('searchBar')).toHaveLength(1)
  })
})
