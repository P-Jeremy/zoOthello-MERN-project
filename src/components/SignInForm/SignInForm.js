import React, { Component } from 'react'
import { Form, Button, Card, Container } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'

export default class SignInForm extends Component {
  state = {
    password: '',
    pseudo: '',
    redirectToUserHome: false
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    const { auth } = nextProps
    const isUserLoggedIn = auth
    return auth === { redirectToUserHome: prevState } ? { redirectToUserHome: prevState } : { redirectToUserHome: isUserLoggedIn }
  }

  handleChange = (e) => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  handleSubmit (e) {
    e.preventDefault()
    const { pseudo, password } = this.state
    const user = {
      pseudo,
      password
    }
    this.props.logIn(user)
  }

  render () {
    const { pseudo, password, redirectToUserHome } = this.state
    const { handleChange, handleSubmit } = this
    if (redirectToUserHome === true) {
      return (<Redirect to="/"/>)
    }
    return (
      <div style={{ margin: '3rem' }}>
        <Container>
          <h2>Connexion</h2>
          <Card style={ { width: 50 + '%', margin: '3rem auto', padding: '2rem' }}>
            <Form onSubmit={handleSubmit.bind(this)}>
              <Form.Group controlId="formBasicPseudo">
                <Form.Label>Pseudo</Form.Label>
                <Form.Control onChange={handleChange.bind(this)} name="pseudo" value={pseudo} type="text" placeholder="Pseudo" />
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Mot de passe</Form.Label>
                <Form.Control onChange={handleChange.bind(this)} name="password" value={password} type="password" placeholder="Mot de passe" />
              </Form.Group>
              <Button variant="secondary" type="submit">
              Valider
              </Button>
            </Form>
          </Card>
        </Container>
      </div>
    )
  }
}

SignInForm.propTypes = {
  logIn: PropTypes.func,
  auth: PropTypes.bool
}
