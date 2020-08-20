import React, { Component } from 'react'
import { Form, Button, Card, Container, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import { authErrors } from '../../lib/authErrors'

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
    if (password !== passwordBis) {
      return toast.error('Les deux mots de passe saisis ne correspondent pas...')
    }
    axios.post(uri, { pseudo, email, password })
      .then((res) => { if (res.status === 200) this.setState({ redirectToHome: true }) })
      .catch(err => {
        if (err.response.data.message === authErrors.email) {
          toast.error('Un utilisateur est déjà enregistré avec cet email')
        }
        if (err.response.data.message === authErrors.invalidPseudo) {
          toast.error('Pseudo invalide')
        }
        if (err.response.data.message === authErrors.pseudo) {
          toast.error('Un utilisateur est déjà enregistré avec ce pseudo')
        }
        if (err.response.data.message === authErrors.password) {
          toast.error('Mot de passe trop faible')
        }
      })
  }

  renderTooltip (field, props) {
    const text = field === 'password'
      ? 'Le mot de passe doit contenir 8 caractères minimum, au moins une majuscule, un chiffre et un caractère spécial'
      : 'Le pseudo doit contenir entre 3 et 15 caractères'

    return <Tooltip {...props}>{text}</Tooltip>
  }

  render () {
    const { email, pseudo, password, passwordBis, redirectToHome } = this.state
    const { handleChange, handleSubmit, renderTooltip } = this
    if (redirectToHome) {
      return (<Redirect to="/"/>)
    }
    return (
      <div style={{ margin: '3rem' }}>
        <ToastContainer autoClose={false} />
        <Container>
          <h2>Inscription</h2>
          <Card className="forms">
            <Form onSubmit={handleSubmit.bind(this)}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control onChange={handleChange.bind(this)} name="email" value={email} type="email" placeholder="Email" />
              </Form.Group>
              <Form.Group controlId="formBasicPseudo">
                <Form.Label>Pseudo</Form.Label>
                <OverlayTrigger
                  placement="auto"
                  delay={{ show: 250, hide: 400 }}
                  overlay={renderTooltip.bind(this, 'pseudo')}
                >
                  <Form.Control onChange={handleChange.bind(this)} name="pseudo" value={pseudo} type="text" placeholder="Pseudo" />
                </OverlayTrigger>
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Mot de passe</Form.Label>
                <OverlayTrigger
                  placement="auto"
                  delay={{ show: 250, hide: 400 }}
                  overlay={renderTooltip.bind(this, 'password')}
                >
                  <Form.Control onChange={handleChange.bind(this)} pattern="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$" name="password" value={password} type="password" placeholder="Mot de passe" />
                </OverlayTrigger>
              </Form.Group>
              <Form.Group controlId="formBasicPasswordBis">
                <Form.Label>Confirmation mot de passe</Form.Label>
                <Form.Control onChange={handleChange.bind(this)} name="passwordBis" value={passwordBis} type="password" placeholder="Confirmer mot de passe" />
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
