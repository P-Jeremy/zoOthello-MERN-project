import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

export default class HomeIn extends Component {
  state = {
    redirectToHome: false
  }

  componentDidMount () {
    const isUserAllowed = JSON.parse(localStorage.getItem('loggedIn'))
    if (!isUserAllowed) this.setState({ redirectToHome: true })
  }

  render () {
    const { redirectToHome } = this.state
    if (redirectToHome) {
      return (<Redirect to="/"/>)
    }
    return (
      <div>
        HOME IN
      </div>
    )
  }
}
