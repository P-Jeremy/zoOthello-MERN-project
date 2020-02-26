import React from 'react'
import PropTypes from 'prop-types'

export const GamesList = ({ games }) => {
  const generateLi = games.map((game) => {
    return (<li key={game._id}>{game._id}</li>)
  })

  return (
    <div>
      <ul>
        {generateLi}
      </ul>
    </div>
  )
}

GamesList.propTypes = {
  games: PropTypes.array
}

export default GamesList
