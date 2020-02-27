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

  autoComplete () {
    const { opponent } = this.state
    axios.post(`${uri}/user/search`, { search: opponent })
      .then(res => {
        this.setState({ opponents: res.data.fetchedUsers }, () => {
          console.log('USERS', this.state.opponents)
        })
      })
  }

  selectOption = (selected) => {
    this.setState({ opponent: selected.pseudo, opponents: [] })
  }

  async handleChange (e) {
    const { name, value } = e.target
    await this.setState({ [name]: value })
    const { opponent } = this.state
    if (opponent.length === 0) {
      return this.setState({ opponents: [] })
    }
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
    const { opponent, opponents } = this.state
    const { handleNewGame, handleChange, selectOption } = this
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
              <ul style={{ listStyle: 'none', padding: 0, textAlign: 'center' }}>
                {
                  opponents.length > 0 && opponents.map((opponent) => <li onClick={() => selectOption(opponent)} key={opponent._id}>{opponent.pseudo}</li>)
                }
              </ul>
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
