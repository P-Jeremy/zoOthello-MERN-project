import React from 'react'
import PropTypes from 'prop-types'

import './Pawn.scss'

export default function Pawn ({ color }) {
  return (
    <div>
      {
        color !== '' &&
        <img className="duckFace" src={`./assets/img/duck-${color === 'black' ? 'red' : 'yellow'}.png`}/>
      }
    </div>
  )
}

Pawn.propTypes = {
  color: PropTypes.string
}
