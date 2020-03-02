import React, { Component } from 'react'
import { Navbar, Nav, Button, NavItem } from 'react-bootstrap'
import PropTypes from 'prop-types'
import './Navbar.scss'

export default class NavbarOthello extends Component {
  state ={
    userAuthenticated: false
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    const { auth } = nextProps
    const isUserLoggedIn = auth
    return auth === { userAuthenticated: prevState } ? { userAuthenticated: prevState } : { userAuthenticated: isUserLoggedIn }
  }

  onLogOut () {
    this.props.logOut()
    window.location.href = '/'
  }

  render () {
    const { userAuthenticated } = this.state
    const { onLogOut } = this

    return (
      <Navbar collapseOnSelect expand="lg" className="nav-zRed" variant="dark" >
        <Navbar.Brand href="/">zOthello</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ml-auto">
            {
              userAuthenticated &&
              <NavItem>
                <Button className="logOut" variant="danger" onClick={onLogOut.bind(this)}>Se déconnecter</Button>
              </NavItem>
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
  auth: PropTypes.bool,
  logOut: PropTypes.func
}
