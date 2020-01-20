import React from 'react'
import PropTypes from 'prop-types'

import './Pawn.css'

export default function Pawn ({ color }) {
  return (
    <div className={`pawn ${color}`} />
  )
}

Pawn.propTypes = {
  color: PropTypes.string
}
