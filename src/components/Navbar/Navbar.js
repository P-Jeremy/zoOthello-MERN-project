import React, { Component } from 'react'
import { Navbar, Nav } from 'react-bootstrap'

export default class navbar extends Component {
  render () {
    return (
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="/">Othello</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav>
            <Nav.Link href="/connexion">Connexion</Nav.Link>
            <Nav.Link eventKey={2} href="/inscription">
            Inscription
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}
