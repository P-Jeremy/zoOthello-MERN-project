import React from 'react'
import PropTypes from 'prop-types'

import './Pawn.scss'

export default function Pawn ({ color }) {
  return (
    <>
      {
        color !== '' &&
        <img alt="duck pawn" data-testid={`test-pawn-${color === 'black' ? 'red' : 'yellow'}`} className={`duckFace ${color === 'black' ? 'red' : 'yellow'}`} src={`./assets/img/duck-${color === 'black' ? 'red' : 'yellow'}.png`}/>
      }
    </>
  )
}

Pawn.propTypes = {
  color: PropTypes.string
}
