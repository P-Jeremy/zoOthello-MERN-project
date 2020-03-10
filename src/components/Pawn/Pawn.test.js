import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Pawn from './Pawn'

let wrapper
beforeEach(() => {
  wrapper = render(
    <Pawn color={'black'}/>
  )
})

describe('Pawn', () => {
  it('Basic rendering', () => {
    const { asFragment } = wrapper
    expect(asFragment()).toMatchSnapshot()
  })

  it('Should have "red" as a className', () => {
    const { getByTestId } = wrapper
    expect(getByTestId('test-pawn')).toHaveClass('red')
  })

  it('Should change "red" className to "yellow" on props change', () => {
    const { rerender, getByTestId } = wrapper
    rerender(<Pawn color={'white'} />)
    expect(getByTestId('test-pawn')).toHaveClass('yellow')
  })
})
