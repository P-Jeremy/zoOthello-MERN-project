import React from 'react'
import Pawn from '../Pawn/Pawn'
import PropTypes from 'prop-types'

import './Square.scss'

export default function Square ({ value, click, rowI, colI }) {
  /**
   * Allows to return a black, white or blank pawn
   * @param {*} v Value of the pawn passed as props
   */
  const returnPawn = (v) => {
    switch (v) {
      case 'BLACK':
        return (<Pawn color={'black'} />)
      case 'WHITE':
        return (<Pawn color={'white'} />)
      case 'BLANK':
        return (<Pawn color="" />)
      default:
        break
    }
  }

  /**
   * Handle moves on click
   * @param {*} x x square coordinate
   * @param {*} y x square coordinate
   */
  const handleClick = (x, y) => {
    return click(x, y)
  }

  /**
   * Handle moves on keyboard
   * @param {*} e event (used to check if Enter key is pressed)
   * @param {*} x x square coordinate
   * @param {*} y x square coordinate
   */
  const handleEnter = (e, x, y) => {
    const code = e.keyCode || e.charCode
    if (code === 13) {
      return click(x, y)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handlePawnDrop = (e, x, y) => {
    e.stopPropagation()
    return click(x, y)
  }

  return (
    <div
      className="zoom"
      tabIndex={0}
      onKeyPress={(e) => handleEnter(e, rowI, colI)}
    >
      <div
        tabIndex={-1}
        className="square"
        data-testid="square"
        onKeyPress={(e) => handleEnter(e, rowI, colI)}
        onClick={() => handleClick(rowI, colI)}
        onDragOver={handleDragOver}
        onDrop={(e) => handlePawnDrop(e, rowI, colI)}
      >
        {returnPawn(value)}
      </div>
    </div>
  )
}

Square.propTypes = {
  value: PropTypes.string,
  click: PropTypes.func,
  rowI: PropTypes.number,
  colI: PropTypes.number
}
