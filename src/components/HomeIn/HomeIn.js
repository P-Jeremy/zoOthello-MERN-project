import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import reversi from 'reversi/index'
import { Button, Form, Container } from 'react-bootstrap'
import axios from 'axios'

const uri = 'http://localhost:3000/api'

const Reversi = reversi.Game

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

  handleChange = (e) => {
    const { name, value } = e.target
    this.setState({ [name]: value })
    axios.post(`${uri}/user/search`, { search: value })
      .then(res => console.log(res))
  }

  getUsersGame (id) {
    axios.get(`${uri}/user/${id}`)
      .then(res => console.log(res))
      .catch(err => console.error(err))
  }

  /**
 * Allows to start a new game
 */
handleNewGame = async () => {
  const origin = 'new'
  const newGame = new Reversi()
  await axios.post(`${uri}/game`, { newGame, origin })
}

render () {
  const { redirectToHome, opponent } = this.state
  const { handleNewGame, handleChange } = this
  if (redirectToHome) {
    return (<Redirect to="/"/>)
  }
  return (
    <div>
      <Container>
        <Form style={ { width: 25 + '%', margin: '3rem auto' }}>
          <Form.Group controlId="pseudo">
            <Form.Label>Nouvelle partie</Form.Label>
            <Form.Control
              type="text"
              onChange={handleChange.bind(this)}
              name="opponent"
              value={opponent}
              className="text-muted"
              placeholder="pseudo de votre adversaire"
            />
          </Form.Group>
          <Button
            type="submit"
            tabIndex={0}
            variant="primary"
            onClick={handleNewGame}>
              Créer
          </Button>
        </Form>
      </Container>
    </div>
  )
}
}
