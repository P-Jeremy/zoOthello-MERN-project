import React from 'react'
import './App.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import NavbarContainer from './components/Navbar/NavbarContainer'
import Game from './components/Game/Game'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import SignUpForm from './components/SignUpForm/SignUpForm'
import HomeOut from './components/HomeOut/HomeOut'
import HomeIn from './components/HomeIn/HomeIn'
import { Provider } from 'react-redux'
import store from './store/store'
import SignInContainer from './components/SignInForm/SignInContainer'

const App = () => (<>
  <div className="App">
    <Provider store={store}>
      <NavbarContainer />
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
              <SignInContainer />
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
    </Provider>
  </div>
</>)

export default App
