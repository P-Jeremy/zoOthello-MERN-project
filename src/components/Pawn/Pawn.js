import React from 'react'
import PropTypes from 'prop-types'

import './Pawn.scss'

export default function Pawn ({ color }) {
  return (
    <>
      {
        color !== '' &&
        <img className={`duckFace ${color === 'black' ? 'red' : 'yellow'}`} src={`./assets/img/duck-${color === 'black' ? 'red' : 'yellow'}.png`}/>
      }
    </>
  )
}

Pawn.propTypes = {
  color: PropTypes.string
}
