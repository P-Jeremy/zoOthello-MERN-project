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
    id: null,
    blackPassCount: 0,
    whitePassCount: 0
  }

  /** MERGE THE RESULT FROM DB INTO A NEW GAME INSTANCE
   * In order to get all Game class methods
   * @param res data from the mongo db
   * @returns game instance of data in state
   */
  turnDataInGameInstance = async (res) => {
    // if (!res.data.length) return
    const newGame = new Reversi()
    const dbGame = res.data.game

    merge(newGame, dbGame)
    const id = res.data._id

    await this.setState({
      id,
      nextPlayer: newGame._nextPieceType,
      game: newGame,
      blackPassCount: res.data.blackPassCount,
      whitePassCount: res.data.whitePassCount
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
        console.log('GAME', res)

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
        toast.info(`Le joueur ${payload.player} a joué: ${hour}h${minute}m${seconds}`)
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
      this.getGameData()
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
  updateGame = ({ origin }) => {
    const { id, game, blackPassCount, whitePassCount } = this.state
    axios.put(`${url}/${id}`, {
      whitePassCount,
      blackPassCount,
      game,
      origin
    })
    return this.setState({ nextPlayer: game._nextPieceType, blackPassCount, whitePassCount })
  }

  /**
 * Allows to change the pawn status if game move is legit
 * @param {*} x pawn X coordinate
 * @param {*} y pawn Y coordinate
 */
  handleClick = (x, y) => {
    const { game } = this.state
    toast.dismiss()
    /* CHECK IF THE MOVE IS LEGAL */
    const report = game.proceed(x, y)
    /* RETURNS IF ILLEGAL MOVE */
    if (!report.isSuccess) {
      return
    }
    this.updateGame({ origin: 'move' })
    return this.countPoints()
  }

  /**
   * Allows to pass turn
   */
  handlePass = async () => {
    let { game, blackPassCount, whitePassCount, nextPlayer } = this.state
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

  /**
 * Allows to reset the game
 */
  handleNewGame = async (playerHasPassedTwice) => {
    const { id, blackPassCount, whitePassCount } = this.state
    const origin = 'new'
    const isTwice = playerHasPassedTwice === 'pass++' ? 'pass++' : null
    const newGame = new Reversi()
    /* IF NO GAME CREATE A NEW ONE */
    if (id === null) {
      const res = await axios.post(url, { newGame, origin })
      return this.setState(
        {
          game: res.data.game,
          nextPlayer: res.data.game._nextPieceType,
          blackPassCount: 0,
          whitePassCount: 0
        })
    }
    /* ELSE CLEAR THE EXISTING ONE */
    return axios.put(`${url}/newGame/${id}`, { newGame, whitePassCount: 0, blackPassCount: 0, origin, isTwice })
      .then((res) => this.setState(
        {
          id: res.data._id,
          game: newGame,
          nextPlayer: newGame._nextPieceType,
          blackPassCount,
          whitePassCount,
          score: null
        }))
      .catch(err => err)
  }

  render () {
    const { nextPlayer, score, game, id } = this.state
    const { handleNewGame, handleClick, handlePass } = this
    return (
      <div className="game" >
        {
          game !== null && !game._isEnded &&
          <ToastContainer autoClose={false} />
        }
        < h1 > Othello</h1 >
        {game !== null && !game._isEnded &&
          <>
            <h2>{`Joueur: ${nextPlayer === 'WHITE' ? 'Blanc' : 'Noir'}`}</h2>
            <span>
              {
                `Noir: ${score === null ? 2 : score.BLACK} points VS
                Blanc: ${score === null ? 2 : score.WHITE} points `
              }
            </span>
          </>
        }
        {game !== null && game.isEnded && <h2>{`Le joueur ${game.getHighScorer() === 'BLACK' ? 'noir' : 'blanc'} a gagné !`}</h2>}
        <section>
          <aside className="aside_left">
            <Button
              tabIndex={0}
              variant={id === null ? 'primary' : 'danger'}
              onClick={handleNewGame}>
              Nouvelle partie
            </Button>
          </aside>
          {
            game !== null &&
            <Board click={handleClick} board={game._board} />
          }
          {
            game !== null &&
            <aside className="aside_right">
              <div className="pass">
                <span className="draggable" draggable>
                  <Pawn color={nextPlayer.toLowerCase()} />
                </span>
                <Button
                  tabIndex={0}
                  onClick={handlePass}>
                  Passer
                </Button>
              </div>
            </aside>
          }
        </section>
      </div >
    )
  }
}

Game.propTypes = {
  match: PropTypes.object
}
