import React, { Component } from 'react'
import { ListGroup } from 'react-bootstrap'
import PropTypes from 'prop-types'
import axios from 'axios'

const uri = 'http://localhost:3000/api/user'

class GamesList extends Component {
  state = {
    opponent: ''
  }

  async componentDidMount () {
    this.getOpponentName(this.props.game.whitePlayer)
  }

  getOpponentName = async (id) => {
    const user = await axios.get(`${uri}/${id}`)
    const pseudo = user.data.fetchedUsers[0].pseudo
    await this.setState({ opponent: pseudo })
  }

  render () {
    const { opponent } = this.state
    return (
      <>
        {
          opponent.length > 0 &&
            <ListGroup.Item action href="#link1">Partie en cours contre {`${opponent}`}</ListGroup.Item>
        }
      </>
    )
  }
}

GamesList.propTypes = {
  game: PropTypes.object
}

export default GamesList
