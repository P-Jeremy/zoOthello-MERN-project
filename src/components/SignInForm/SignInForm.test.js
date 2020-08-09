import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import SignInForm from './SignInForm'

describe('<SignInForm />', () => {
  let wrapper

  beforeEach(() => {
    wrapper = render(
      <SignInForm />
    )
  })

  it('renders', () => {
    const { asFragment } = wrapper
    expect(asFragment()).toMatchSnapshot()
  })

  it('it has a disabled button until both pseudo and password field have a value', () => {
    const pseudo = 'pseudo'
    const password = 'password'

    const { getByPlaceholderText, getByText } = wrapper

    const submitButton = getByText('Valider')
    expect(submitButton.disabled).toEqual(true)

    const pseudofieldNode = getByPlaceholderText('Pseudo')
    fireEvent.change(pseudofieldNode, { target: { value: pseudo } })
    expect(submitButton.disabled).toEqual(true)

    const passwordfieldNode = getByPlaceholderText('Mot de passe')
    fireEvent.change(passwordfieldNode, { target: { value: password } })
    expect(passwordfieldNode.value).toEqual(password)
    expect(pseudofieldNode.value).toEqual(pseudo)
    expect(submitButton.disabled).toEqual(false)
  })
})
