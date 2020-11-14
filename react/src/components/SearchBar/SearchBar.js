import React, { Component } from 'react'
import { Button, Form, Container } from 'react-bootstrap'
import './SearchBar.scss'

import axios from 'axios'

const uri = `${process.env.URI}/api`

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
    const { opponent, userId } = this.state
    axios.post(`${uri}/user/search`, { search: opponent })
      .then(res => {
        const filteredRes = res.data.fetchedUsers.filter((opponent) => opponent._id !== userId)
        this.setState({ opponents: filteredRes })
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
    const { userId, opponentId } = this.state
    axios.post(`${uri}/game`, { blackPlayer: userId, whitePlayer: opponentId })
      .then(() => {
        this.setState({ opponent: '' })
      })
  }

  render () {
    const { opponent, opponents } = this.state
    const { handleNewGame, handleChange, selectOption } = this
    return (
      <div className="searchBar" data-testid="searchBar">
        <Container>
          <Form autoComplete="off" style={ { position: 'relative', margin: '3rem auto' }} onSubmit={handleNewGame.bind(this)}>
            <Form.Group style={{ position: 'relative', zIndex: 1, width: '15rem', margin: '0 auto' }} controlId="pseudo">
              <Form.Label>Nouvelle partie :</Form.Label>
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
                <ul style={{ listStyle: 'none', padding: 0, textAlign: 'center', backgroundColor: 'white', border: '1px solid lightGrey', borderRadius: '3px' }}>
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
            <div
              style={{ position: 'absolute', left: '0', right: '0', top: '5rem', zIndex: 0, width: '100%' }}
            >
              <Button
                type="submit"
                tabIndex={0}
                variant="dark"
              >
              Créer
              </Button>
            </div>
          </Form>
        </Container>
      </div>
    )
  }
}
