import React, { Component } from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import PropTypes from 'prop-types'

export default class NavbarOthello extends Component {
  state ={
    userAuthenticated: false
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    const { auth } = nextProps
    const isUserLoggedIn = auth
    return auth === { userAuthenticated: prevState } ? { userAuthenticated: prevState } : { userAuthenticated: isUserLoggedIn }
  }

  render () {
    const { userAuthenticated } = this.state

    return (
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="/">Othello</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav>
            {
              userAuthenticated &&
            <Nav.Link href="/connexion">Se déconnecter</Nav.Link>
            }
            {
              !userAuthenticated &&
              <>
                <Nav.Link href="/connexion">Connexion</Nav.Link>
                <Nav.Link eventKey={2} href="/inscription">
                  Inscription
                </Nav.Link>
              </>
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

NavbarOthello.propTypes = {
  auth: PropTypes.bool
}
