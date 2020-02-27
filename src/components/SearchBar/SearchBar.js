import React, { Component } from 'react'
import reversi from 'reversi/index'
import { Button, Form, Container } from 'react-bootstrap'
import './SearchBar.scss'

import axios from 'axios'

const uri = 'http://localhost:3000/api'

const Reversi = reversi.Game

export default class SearchBar extends Component {
  state = {
    opponent: '',
    userId: '',
    opponentId: '',
    opponents: []
  }

  componentDidMount () {
    const id = localStorage.getItem('userId')
    this.setState({ userId: id })
  }

  autoComplete () {
    const { opponent } = this.state
    axios.post(`${uri}/user/search`, { search: opponent })
      .then(res => {
        this.setState({ opponents: res.data.fetchedUsers })
      })
  }

  selectOption = (selected) => {
    this.setState({ opponent: selected.pseudo, opponentId: selected._id, opponents: [] })
  }

  async handleChange (e) {
    const { name, value } = e.target
    await this.setState({ [name]: value })
    const { opponent } = this.state
    if (opponent.length === 0) {
      return this.setState({ opponents: [] })
    }
    if (opponent.length > 2) {
      this.autoComplete()
    }
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
              {
                opponents.length > 0 &&
                <ul style={{ listStyle: 'none', padding: 0, textAlign: 'center', zIndex: 1, border: '1px solid lightGrey', borderRadius: '3px' }}>
                  {
                    opponents.map((opponent) => <li
                      className='opponentsOptions'
                      style={{ cursor: 'pointer' }}
                      onClick={() => selectOption(opponent)}
                      key={opponent._id}>{opponent.pseudo}
                    </li>)
                  }
                </ul>
              }
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
