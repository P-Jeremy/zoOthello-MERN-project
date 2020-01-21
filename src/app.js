import React, { Component } from 'react'
import './App.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from './components/Navbar/Navbar'
import Game from './components/Game/Game'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import SignInForm from './components/SignInForm/SignInForm'
import SignUpForm from './components/SignUpForm/SignUpForm'

export default class App extends Component {
  render () {
    return (
      <div className="App" >
        <Navbar/>
        <main>
          <Router>
            <Switch>
              <Route path="/game">
                <Game />
              </Route>
              <Route path="/connexion">
                <SignInForm/>
              </Route>
              <Route path="/inscription">
                <SignUpForm/>
              </Route>
            </Switch>
          </Router>
        </main>
      </div>
    )
  }
}
