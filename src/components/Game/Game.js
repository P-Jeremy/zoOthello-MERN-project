import React, { Component } from 'react'
import './Game.scss'
import { Button } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify'
import PropTypes from 'prop-types'
import Board from '../Board/Board'
import merge from 'lodash.merge'
import reversi from 'reversi/index'
import axios from 'axios'
import openSocket from 'socket.io-client'
import Pawn from '../Pawn/Pawn'

import 'react-toastify/dist/ReactToastify.css'

const uri = 'http://localhost:3000'

const socket = openSocket(uri)

const Reversi = reversi.Game

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
    whitePlayer: {}
  }

  /** MERGE THE RESULT FROM DB INTO A NEW GAME INSTANCE
   * In order to get all Game class methods
   * @param res data from the mongo db
   * @returns game instance of data in state
   */
  turnDataInGameInstance = async (res) => {
    // if (!res.data.length) return
    const newGame = new Reversi()
    const dbGame = res.data.gameData.game
    merge(newGame, dbGame)
    const gameId = res.data.gameData._id

    await this.setState({
      gameId,
      nextPlayer: newGame._nextPieceType,
      game: newGame,
      blackPassCount: res.data.gameData.blackPassCount,
      whitePassCount: res.data.gameData.whitePassCount,
      blackPlayer: res.data.blackPlayerData,
      whitePlayer: res.data.whitePlayerData
    })

    return this.countPoints()
  }

  /**
   * FETCH GAME DATA FROM DB
   * And turn it into Game instance
   */
  getGameData = (gameId) => {
    axios.get(`${url}/one/${gameId}`).then(res => {
      if (res) {
        this.turnDataInGameInstance(res)
      }
    })
      .catch(err => err)
  }

  /**
   * Allows to create a toaster message depending on the provided payload and
   * @param {*} payload payload provided by the socket
   * @param {*} player actual player
   * @returns a toast() implementation with corresponding message
   */
  toaster (payload, player) {
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
        toast.warn(`Le joueur ${payload.player} a passé`)
        break
      case 'pass++':
        toast.warn(`Le joueur ${player === 'BLACK' ? 'blanc' : 'noir'} a encore passé `)
        toast.error(`Le joueur ${player === 'BLACK' ? 'blanc' : 'noir'} a perdu `)
        toast.info('Nouvelle partie')
        break
      default:
        break
    }
  }

  componentDidMount () {
    const gameId = this.props.match.params.id
    this.getGameData(gameId)
    document.title = 'Game'
    socket.on('gameUpdated', (payload) => {
      this.toaster(payload)
      this.getGameData(gameId)
    })
  }

  /**
 * Allows to get the game score
 * set the score state according to countByPieceType() method results
 */
  countPoints = () => {
    const { game } = this.state
    if (game !== null) {
      const score = game.board.countByPieceType()
      return this.setState({ score: score })
    }
  }

  /**
   * Update the game in DB
   */
  updateGame = ({ origin, player }) => {
    const { gameId, game, blackPassCount, whitePassCount } = this.state
    axios.put(`${url}/${gameId}`, {
      whitePassCount,
      blackPassCount,
      game,
      origin,
      player
    })
    return this.setState({ nextPlayer: game._nextPieceType, blackPassCount, whitePassCount })
  }

  /**
   * Check if the actual user is allowed to play
   * @returns true or undefined
   */
  isUserAllowedToPlay = () => {
    const userId = localStorage.getItem('userId')
    const { blackPlayer, game, whitePlayer } = this.state
    if (game._nextPieceType === 'BLACK') {
      if (userId === blackPlayer._id) { return true } else {
        toast.error('Attendez votre tour...')
        return false
      }
    } else if (game._nextPieceType === 'WHITE') {
      if (userId === whitePlayer._id) { return true } else {
        toast.error('Attendez votre tour...')
        return false
      }
    }
  }

  /**
 * Allows to change the pawn status if game move is legit
 * @param {*} x pawn X coordinate
 * @param {*} y pawn Y coordinate
 */
  handleClick = (x, y) => {
    const { game, blackPlayer, whitePlayer } = this.state
    toast.dismiss()
    if (!this.isUserAllowedToPlay()) return
    /* CHECK IF THE MOVE IS LEGAL */
    const report = game.proceed(x, y)
    /* RETURNS IF ILLEGAL MOVE */
    if (!report.isSuccess) {
      return
    }
    this.updateGame({ origin: 'move', player: game._nextPieceType === 'WHITE' ? blackPlayer.pseudo : whitePlayer.pseudo })
    return this.countPoints()
  }

  /**
   * Allows to pass turn
   */
  handlePass = async () => {
    let { game, blackPassCount, whitePassCount, nextPlayer } = this.state
    if (!this.isUserAllowedToPlay()) return
    let origin
    switch (game._nextPieceType) {
      case 'BLACK':
        game._nextPieceType = 'WHITE'
        blackPassCount++
        nextPlayer = 'WHITE'
        break
      case 'WHITE':
        game._nextPieceType = 'BLACK'
        whitePassCount++
        nextPlayer = 'BLACK'
        break
      default:
        break
    }

    if (blackPassCount > 1 || whitePassCount > 1) {
      origin = 'pass++'
      return this.handleNewGame(origin)
    }
    origin = 'pass'
    await this.setState({ nextPlayer, whitePassCount: whitePassCount, blackPassCount: blackPassCount })
    return this.updateGame({ origin })
  }

  render () {
    const { nextPlayer, score, game, blackPlayer, whitePlayer } = this.state
    const { handleClick, handlePass } = this
    return (
      <div className="game" >
        {
          game !== null && !game._isEnded &&
          <ToastContainer autoClose={false} />
        }
        {game !== null && !game._isEnded &&
          <>
            <h2>{`A ${nextPlayer === 'WHITE' ? whitePlayer.pseudo : blackPlayer.pseudo} de jouer !`}</h2>
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
