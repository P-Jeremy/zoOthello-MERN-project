import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Container, ListGroup } from 'react-bootstrap'
import axios from 'axios'
import SearchBar from '../SearchBar/SearchBar'
import GamesList from '../GamesList/GamesList'
import openSocket from 'socket.io-client'
import './HomeIn.scss'

const socketUrl = 'http://localhost:3000'

const socket = openSocket(socketUrl)

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
    this.setState({ userId: user })
    socket.on('gameUpdated', () => {
      this.updateVue()
    })
  }

  /**
   * Allows to get all games played by the user
   * @param {} id
   * @returns a setSate with the result array
   */
  getUsersGame (id) {
    return axios.get(`${uri}/game/user/${id}`)
      .then(res => this.setState({ games: res.data }))
      .catch(err => console.error(err))
  }

  /**
   * Allows the child component to triggers a new axios get
   */
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
      <Container className="gamesList">
        <SearchBar/>
        {
          games.length > 0 &&
          <ListGroup>
            <div>
              <h3>Partie(s) en cours</h3>
              {games.map((game) => <GamesList updateVue={updateVue.bind(this)} key={game._id} gameData={game} />)}
            </div>
          </ListGroup>
        }
      </Container>
    )
  }
}
