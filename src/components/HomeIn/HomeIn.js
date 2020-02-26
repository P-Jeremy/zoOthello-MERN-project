import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import SearchBar from '../SearchBar/SearchBar'

const uri = 'http://localhost:3000/api'

export default class HomeIn extends Component {
  state = {
    redirectToHome: false,
    userId: '',
    opponent: '',
    opponents: [],
    games: []
  }

  componentDidMount () {
    const isUserAllowed = JSON.parse(localStorage.getItem('loggedIn'))
    const user = localStorage.getItem('userId')
    if (!isUserAllowed) this.setState({ redirectToHome: true })
    this.getUsersGame(user)
    return this.setState({ userId: user })
  }

  getUsersGame (id) {
    axios.get(`${uri}/user/${id}`)
      .then(res => console.log(res))
      .catch(err => console.error(err))
  }

  render () {
    const { redirectToHome } = this.state
    if (redirectToHome) {
      return (<Redirect to="/"/>)
    }
    return (
      <div>
        <SearchBar/>
      </div>
    )
  }
}
