import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import HomeOut from './HomeOut'

describe('HomeOut', () => {
  let wrapper

  beforeEach(() => {
    wrapper = render(
      <HomeOut />
    )
  })

  it('Basic rendering', () => {
    const { asFragment } = wrapper
    expect(asFragment()).toMatchSnapshot()
  })
})
