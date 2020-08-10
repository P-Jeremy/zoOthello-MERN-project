import React from 'react'
import Row from '../Row/Row'
import PropTypes from 'prop-types'
import './Board.scss'

export default function Board ({ board, click }) {
  return (
    <div className="board_container">
      <div className="board">
        {board._squares.map((col, i) =>
          <Row key={i} click={click} col={col} />
        )}
      </div>
    </div>
  )
}

Board.propTypes = {
  board: PropTypes.object,
  click: PropTypes.func,
  pieceType: PropTypes.string
}
