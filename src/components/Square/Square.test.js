import 'jsdom-global/register'
import React from 'react'
import { configure, mount } from 'enzyme'
import TestRenderer from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-16'
import Square from './Square'

configure({ adapter: new Adapter() })

let renderer
const click = jest.fn()
beforeEach(() => {
  renderer = mount(
    <Square
      rowI={3}
      colI={3}
      value={'WHITE'}
      click={click} />
  )
})

describe('Square', () => {
  it('Basic rendering', () => {
    const renderer = TestRenderer.create(
      <Square value={'WHITE'}/>)
    const result = renderer.toJSON()
    expect(result).toMatchSnapshot()
  })

  it('should render one pawn', () => {
    expect(renderer.find('img')).toHaveLength(1)
  })

  it('should render one pawn with className "yellow"', () => {
    expect(renderer.find('.yellow')).toHaveLength(1)
  })

  it('should render one pawn with className "red" on props value={"BLACK"}', () => {
    renderer.setProps({ value: 'BLACK' })
    expect(renderer.find('.red')).toHaveLength(1)
  })
})
