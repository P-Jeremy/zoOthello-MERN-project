import React, { Component } from 'react'
import './App.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import Game from './components/Game/Game'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

export default class App extends Component {
  render () {
    return (
      <div className="App" >
        <main>
          <Router>
            <Switch>
              <Route path="/game">
                <Game />
              </Route>
            </Switch>
          </Router>
        </main>
      </div>
    )
  }
}
