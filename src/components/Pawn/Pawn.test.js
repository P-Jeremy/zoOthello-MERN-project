import 'jsdom-global/register'
import React from 'react'
import TestRenderer from 'react-test-renderer'
import Pawn from './Pawn'

let renderer
beforeEach(() => {
  renderer = TestRenderer.create(
    <Pawn color={'black'}/>
  )
})

describe('Pawn', () => {
  it('Basic rendering', () => {
    const result = renderer.toJSON()
    expect(result).toMatchSnapshot()
  })

  it('Should have "black" as a className', () => {
    const instance = renderer.root
    const element = instance.findByType('div')
    expect(element.props.className.includes('black')).toBe(true)
  })

  it('Should change "black" className to white on props change', () => {
    renderer.update(<Pawn color={'white'}/>)
    const instance = renderer.root
    const element = instance.findByType('div')
    const result = renderer.toJSON()
    expect(result).toMatchSnapshot()
    expect(element.props.className.includes('white')).toBe(true)
  })
})
