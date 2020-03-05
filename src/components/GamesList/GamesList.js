import React, { Component } from 'react'
import { ListGroup, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

import PropTypes from 'prop-types'
import axios from 'axios'
import './GamesList.scss'

const uri = 'http://localhost:3000/api'

class GamesList extends Component {
  state = {
    opponent: { _id: '', pseudo: '' },
    userId: '',
    currentPlayerId: ''
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    const { gameData } = nextProps
    const currentPlayer = gameData.currentPlayer
    return currentPlayer === { currentPlayerId: prevState } ? { currentPlayerId: prevState } : { currentPlayerId: currentPlayer }
  }

  async componentDidMount () {
    const userId = localStorage.getItem('userId')
    const opponentId = userId === this.props.gameData.whitePlayer ? this.props.gameData.blackPlayer : this.props.gameData.whitePlayer
    this.getOpponent(opponentId)
    await this.setState({ currentPlayerId: this.props.gameData.currentPlayer, userId })
  }

  getOpponent = async (opponentId) => {
    const user = await axios.get(`${uri}/user/${opponentId}`)
    const result = user.data.fetchedUsers[0]
    await this.setState({ opponent: result })
  }

  deleteGame () {
    const gameId = this.props.gameData._id
    axios.delete(`${uri}/game/delete/${gameId}`)
      .then(() => this.props.updateVue())
  }

  render () {
    const { gameData } = this.props
    const { opponent, currentPlayerId, userId } = this.state
    const { deleteGame } = this
    return (
      <>
        {
          opponent.pseudo.length > 0 &&
          <div className= "listItem">
            <ListGroup.Item className="gamesListItem" action variant="secondary" href={`/game/${gameData._id}`}>
              <span>Toi vs {`${opponent.pseudo} ${currentPlayerId === userId ? '(à ton tour)' : ''}`}
              </span>
            </ListGroup.Item>
            <Button variant="danger" className="deleteBtn" onClick={deleteGame.bind(this)}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </div>
        }
      </>
    )
  }
}

GamesList.propTypes = {
  gameData: PropTypes.object,
  updateVue: PropTypes.func
}

export default GamesList
