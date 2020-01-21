import React, { Component } from 'react'
import { Form, Button, Card, Container } from 'react-bootstrap'

export default class SignInForm extends Component {
  render () {
    return (
      <Container>
        <Card>
          <Form>
            <Form.Group controlId="formBasicPseudo">
              <Form.Label>Pseudo</Form.Label>
              <Form.Control type="email" placeholder="Pseudo" />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control type="password" placeholder="Password" />
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
