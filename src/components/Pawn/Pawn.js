import React from 'react'
import PropTypes from 'prop-types'

import './Pawn.scss'

export default function Pawn ({ color }) {
  return (
    <div className={`pawn ${color}`} />
  )
}

Pawn.propTypes = {
  color: PropTypes.string
}
