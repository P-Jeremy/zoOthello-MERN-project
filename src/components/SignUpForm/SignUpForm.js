import React, { Component } from 'react'
import { Form, Button, Card, Container } from 'react-bootstrap'

export default class SignUpForm extends Component {
  render () {
    return (
      <Container>
        <Card>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Email" />
            </Form.Group>
            <Form.Group controlId="formBasicPseudo">
              <Form.Label>Pseudo</Form.Label>
              <Form.Control type="email" placeholder="Email" />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control type="password" placeholder="Mot de passe" />
            </Form.Group>
            <Form.Group controlId="formBasicPasswordBis">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control type="password" placeholder="Confirmer mot de passe" />
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
