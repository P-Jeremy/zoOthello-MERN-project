import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Container, ListGroup } from 'react-bootstrap'
import axios from 'axios'
import SearchBar from '../SearchBar/SearchBar'
import GamesList from '../GamesList/GamesList'
import './HomeIn.scss'

const uri = 'http://localhost:3000/api'

export default class HomeIn extends Component {
  state = {
    redirectToHome: false,
    userId: '',
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
    axios.get(`${uri}/game/user/${id}`)
      .then(res => this.setState({ games: res.data }))
      .catch(err => console.error(err))
  }

  updateVue () {
    const { userId } = this.state
    this.getUsersGame(userId)
  }

  render () {
    const { redirectToHome, games } = this.state
    const { updateVue } = this
    if (redirectToHome) {
      return (<Redirect to="/"/>)
    }
    return (
      <div>
        <SearchBar/>
        <Container className="gamesList">
          <ListGroup>
            {
              games.length > 0 &&
              <div>
                <h3>Partie(s) en cours</h3>
                {games.map((game) => <GamesList updateVue={updateVue.bind(this)} key={game._id} game={game} />)}
              </div>
            }
          </ListGroup>
        </Container>
      </div>
    )
  }
}
