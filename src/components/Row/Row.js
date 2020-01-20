import React from 'react'
import Square from '../Square/Square'
import PropTypes from 'prop-types'
import './Row.scss'

export default function Row ({ col, click }) {
  return (
    < div className="row">
      {col.map((square, i) => (
        <Square
          key={i}
          rowI={square._rowIndex}
          colI={square._colIndex}
          value={square._pieceType}
          click={click} />))}
    </div >
  )
}

Row.propTypes = {
  col: PropTypes.array,
  click: PropTypes.func
}
