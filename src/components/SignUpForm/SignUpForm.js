import React, { Component } from 'react'
import { Form, Button, Card, Container } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
import axios from 'axios'

const uri = 'http://localhost:3000/api/user'

export default class SignUpForm extends Component {
  state = {
    email: '',
    password: '',
    passwordBis: '',
    pseudo: '',
    redirectToHome: false
  }

  handleChange = (e) => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  handleSubmit (e) {
    e.preventDefault()
    const { pseudo, email, password, passwordBis } = this.state
    if (password !== passwordBis) return false
    axios.post(uri, { pseudo, email, password })
      .then((res) => { if (res.status === 200) this.setState({ redirectToHome: true }) })
      .catch(err => console.error(err))
  }

  render () {
    const { email, pseudo, password, passwordBis, redirectToHome } = this.state
    const { handleChange, handleSubmit } = this
    if (redirectToHome) {
      return (<Redirect to="/"/>)
    }
    return (
      <Container>
        <Card>
          <Form onSubmit={handleSubmit.bind(this)}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control onChange={handleChange.bind(this)} name="email" value={email} type="email" placeholder="Email" />
            </Form.Group>
            <Form.Group controlId="formBasicPseudo">
              <Form.Label>Pseudo</Form.Label>
              <Form.Control onChange={handleChange.bind(this)} name="pseudo" value={pseudo} type="text" placeholder="Pseudo" />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control onChange={handleChange.bind(this)} name="password" value={password} type="password" placeholder="Mot de passe" />
            </Form.Group>
            <Form.Group controlId="formBasicPasswordBis">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control onChange={handleChange.bind(this)} name="passwordBis" value={passwordBis} type="password" placeholder="Confirmer mot de passe" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Valider
            </Button>
          </Form>
        </Card>
      </Container>
    )
  }
}
