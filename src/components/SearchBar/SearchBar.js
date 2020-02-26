import React, { Component } from 'react'
import reversi from 'reversi/index'
import { Button, Form, Container } from 'react-bootstrap'
import axios from 'axios'

const uri = 'http://localhost:3000/api'

const Reversi = reversi.Game

export default class SearchBar extends Component {
  state = {
    opponent: '',
    opponents: []
  }

  componentDidMount () {
  }

  autoComplete () {
    const { opponent } = this.state
    axios.post(`${uri}/user/search`, { search: opponent })
      .then(res => {
        this.setState({ opponents: res.data.fetchedUsers }, () => {
          console.log('USERS', this.state.opponents)
        })
      })
  }

  async handleChange (e) {
    const { name, value } = e.target
    await this.setState({ [name]: value })
    this.autoComplete()
  }

  /**
 * Allows to start a new game
 */
  handleNewGame () {
    const origin = 'new'
    const newGame = new Reversi()
    axios.post(`${uri}/game`, { newGame, origin })
  }

  render () {
    const { opponent } = this.state
    const { handleNewGame, handleChange } = this
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
