import React, { Component } from 'react'
import './Game.scss'
import { Button } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify'
import PropTypes from 'prop-types'
import Board from '../Board/Board'
import axios from 'axios'
import openSocket from 'socket.io-client'
import Pawn from '../Pawn/Pawn'

import 'react-toastify/dist/ReactToastify.css'

const uri = 'http://localhost:3000'

const socket = openSocket(uri)

const url = `${uri}/api/game`

export default class Game extends Component {
  state = {
    game: null,
    nextPlayer: 'BLACK',
    score: null,
    gameId: null,
    blackPassCount: 0,
    whitePassCount: 0,
    blackPlayer: {},
    whitePlayer: {},
    currentPlayer: ''
  }

  getGameData = (gameId) => {
    axios.get(`${url}/one/${gameId}`).then(res => {
      if (res) {
        this.setState({
          gameId: res.data.gameData._id,
          nextPlayer: res.data.gameData.game._nextPieceType,
          game: res.data.gameData.game,
          blackPassCount: res.data.gameData.blackPassCount,
          whitePassCount: res.data.gameData.whitePassCount,
          blackPlayer: res.data.blackPlayerData,
          whitePlayer: res.data.whitePlayerData,
          currentPlayer: res.data.currentPlayer,
          score: res.data.gameData.score
        })
        return this.countPoints()
      }
    })
      .catch(err => err)
  }

  handleToaster (payload) {
    if (payload.id !== this.state.gameId) return false
    const hour = new Date().getHours()
    const minute = new Date().getMinutes()
    const seconds = new Date().getSeconds()
    switch (payload.origin) {
      case 'new':
        toast.info('Nouvelle partie')
        break
      case 'move':
        toast.info(`${payload.player} a joué: ${hour}h${minute}m${seconds}`)
        break
      case 'pass':
        toast.warn(`${payload.player} a passé`)
        break
      case 'hasPassedTwice':
        toast.warn(`${payload.player} a encore passé `)
        toast.error(`${payload.player} a perdu `)
        toast.info('Nouvelle partie')
        break
      default:
        break
    }
  }

  isUserAuth () {
    const userId = localStorage.getItem('userId')
    return userId || false
  }

  redirectToHome () {
    window.location.href = '/'
  }

  componentDidMount () {
    document.title = 'Game'
    const gameId = this.props.match.params.id
    if (!this.isUserAuth()) this.redirectToHome()
    this.getGameData(gameId)
    socket.on('gameUpdated', (payload) => {
      this.handleToaster(payload)
      this.getGameData(gameId)
    })

    socket.on('notAllowed', (payloadUserId) => {
      const userId = localStorage.getItem('userId')
      if (userId === String(payloadUserId)) {
        toast.error('Attends ton tour...coin-coin')
      }
    })
  }

  updateGameOnMove = async (coordinates) => {
    const { gameId } = this.state
    const userId = localStorage.getItem('userId')
    const result = await axios.put(`${url}/update/move/${gameId}`, {
      userId,
      coordinates
    })
    const { game, blackPassCount, whitePassCount, score, currentPlayer } = result.data

    return this.setState({
      nextPlayer: game._nextPieceType,
      game,
      blackPassCount,
      whitePassCount,
      score,
      currentPlayer
    })
  }

  updateGameOnPass = async () => {
    const { gameId } = this.state
    const userId = localStorage.getItem('userId')
    const result = await axios.put(`${url}/update/pass/${gameId}`, {
      userId
    })
    const { game, blackPassCount, whitePassCount, score, currentPlayer } = result.data

    return this.setState({
      nextPlayer: game._nextPieceType,
      game,
      blackPassCount,
      whitePassCount,
      score,
      currentPlayer
    })
  }

  handleClick = (x, y) => {
    toast.dismiss()
    const coordinates = {
      x,
      y
    }
    return this.updateGameOnMove(coordinates)
  }

  handlePass = async () => {
    return this.updateGameOnPass()
  }

getTurnUserName = () => {
  const userId = localStorage.getItem('userId')
  const { whitePlayer, blackPlayer, nextPlayer } = this.state
  let name = ''
  switch (nextPlayer) {
    case 'WHITE':
      name = userId === whitePlayer._id ? 'toi' : whitePlayer.pseudo
      return name
    case 'BLACK':
      name = userId === blackPlayer._id ? 'toi' : blackPlayer.pseudo
      return name
    default:
      break
  }
}

render () {
  const { nextPlayer, score, game, blackPlayer, whitePlayer } = this.state
  const { handleClick, handlePass, getTurnUserName } = this

  return (
    <div className="game" >
      {
        game !== null && !game._isEnded &&
          <ToastContainer autoClose={false} />
      }
      {game !== null && !game._isEnded &&
          <>
            <h2>{`A ${getTurnUserName()} de jouer !`}</h2>
            <span>
              {
                `${blackPlayer.pseudo}: ${score === null ? 2 : score.BLACK} points VS
                ${whitePlayer.pseudo}: ${score === null ? 2 : score.WHITE} points `
              }
              <div className="pass">
                <span className="draggable" draggable>
                  <Pawn color={nextPlayer.toLowerCase()} />
                </span>
                <Button
                  tabIndex={0}
                  variant="danger"
                  onClick={handlePass}>
                  Passer
                </Button>
              </div>
            </span>
          </>
      }
      {game !== null && game.isEnded && <h2>{`Le joueur ${game.getHighScorer() === 'BLACK' ? 'noir' : 'blanc'} a gagné !`}</h2>}
      <section>
        {
          game !== null &&
            <Board click={handleClick} board={game._board} />
        }
      </section>
    </div >
  )
}
}

Game.propTypes = {
  match: PropTypes.object
}
