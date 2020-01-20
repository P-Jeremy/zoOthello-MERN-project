import React, { Component } from 'react'
import './App.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import Game from './components/Game/Game'

export default class App extends Component {
  render () {
    return (
      <div className="App" >
        <main>
          <Game />
        </main>
      </div>
    )
  }
}
