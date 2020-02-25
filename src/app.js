import React from 'react'
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
import HomeOut from './components/HomeOut/HomeOut'
import HomeIn from './components/HomeIn/HomeIn'

const App = () => (<>
  <div className="App">
    <Navbar />
    <main>
      <Router>
        <Switch>
          <Route exact path="/">
            <HomeOut />
          </Route>
          <Route path="/game">
            <Game />
          </Route>
          <Route path="/connexion">
            <SignInForm />
          </Route>
          <Route path="/inscription">
            <SignUpForm />
          </Route>
          <Route path="/home/user">
            <HomeIn />
          </Route>
        </Switch>
      </Router>
    </main>
  </div>
</>)

export default App
