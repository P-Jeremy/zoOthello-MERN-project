import React, { Component } from 'react'
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
import SignInContainer from './components/SignInForm/SignInContainer'
import PropTypes from 'prop-types'

class App extends Component {
  state = {
    loggedIn: false
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    const { auth } = nextProps
    return auth === { loggedIn: prevState } ? { loggedIn: prevState } : { loggedIn: auth }
  }

  async componentDidMount () {
    await this.props.checkAuth()
    const isAuth = this.props.auth
    this.setState({ loggedIn: isAuth })
  }

  render () {
    const { loggedIn } = this.state
    return (
      <div className="App" >
        <NavbarContainer/>
        <main>
          <Router>
            <Switch>
              <Route exact path="/">
                {
                  loggedIn && <HomeIn/>
                }
                {
                  !loggedIn && <HomeOut/>
                }
              </Route>
              <Route path="/game/:id" component={Game}/>
              <Route path="/connexion">
                <SignInContainer/>
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

App.propTypes = {
  checkAuth: PropTypes.func,
  auth: PropTypes.bool
}

export default App
