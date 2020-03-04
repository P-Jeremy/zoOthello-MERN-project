import React, { Component } from 'react'
import { ListGroup, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import axios from 'axios'
import './GamesList.scss'

const uri = 'http://localhost:3000/api'

class GamesList extends Component {
  state = {
    opponent: { _id: '', pseudo: '' },
    isCurrentPlayerTurn: false
  }

  async componentDidMount () {
    const userId = localStorage.getItem('userId')
    const opponentId = userId === this.props.gameData.whitePlayer ? this.props.gameData.blackPlayer : this.props.gameData.whitePlayer
    this.getOpponent(opponentId)
    const isItUserTurn = this.getCurrentGameTurn(userId)
    await this.setState({ isCurrentPlayerTurn: isItUserTurn })
  }

  getOpponent = async (opponentId) => {
    const user = await axios.get(`${uri}/user/${opponentId}`)
    const result = user.data.fetchedUsers[0]
    await this.setState({ opponent: result })
  }

  getCurrentGameTurn = id => {
    let isUserTurn = false
    const { gameData } = this.props
    const { blackPlayer, whitePlayer, game } = gameData
    switch (game._nextPieceType) {
      case 'WHITE':
        isUserTurn = id === whitePlayer
        return isUserTurn
      case 'BLACK':
        isUserTurn = id === blackPlayer
        return isUserTurn
      default:
        break
    }
  }

  deleteGame () {
    const gameId = this.props.gameData._id
    axios.delete(`${uri}/game/delete/${gameId}`)
      .then(() => this.props.updateVue())
  }

  render () {
    const { gameData } = this.props
    const { opponent, isCurrentPlayerTurn } = this.state
    const { deleteGame } = this
    return (
      <>
        {
          opponent.pseudo.length > 0 &&
            <ListGroup.Item className="gamesListItem" action variant="secondary" href={`/game/${gameData._id}`}>
              <span>Toi vs {`${opponent.pseudo} ${isCurrentPlayerTurn ? '(à ton tour)' : ''}`}</span>

              <Button variant="danger" onClick={deleteGame.bind(this)}>Supprimer</Button>
            </ListGroup.Item>
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
