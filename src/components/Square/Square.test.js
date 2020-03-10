import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Square from './Square'

const click = jest.fn()
let wrapper
beforeEach(() => {
  wrapper = render(
    <Square
      rowI={3}
      colI={3}
      value={'WHITE'}
      click={click} />
  )
})

describe('Square', () => {
  it('Basic rendering', () => {
    const { asFragment } = wrapper
    expect(asFragment()).toMatchSnapshot()
  })

  it('should render one pawn', () => {
    const { queryAllByAltText } = wrapper
    const img = queryAllByAltText('duck pawn')
    expect(img).toHaveLength(1)
  })

  it('should render one pawn with className "yellow"', () => {
    const { getByAltText } = wrapper
    const img = getByAltText('duck pawn')
    expect(img).toHaveClass('yellow')
  })

  it('should render one pawn with className "red" on props value={"BLACK"}', () => {
    const { rerender } = wrapper
    rerender(<Square value={'BLACK'} />)
    const img = wrapper.getByAltText('duck pawn')
    expect(img).toHaveClass('red')
  })
})
