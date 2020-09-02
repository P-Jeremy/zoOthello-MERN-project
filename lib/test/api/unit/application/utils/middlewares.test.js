// Chai
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))
chai.use(require('chai-sorted'))
// Sinon
const sinon = require('sinon')
chai.use(require('sinon-chai'))
// Other
const bcrypt = require('bcryptjs')
const { checkFormatForInputPseudo, checkFormatAndHashInputPassword } = require('./../../../../../application/utils/middlewares')

describe('Unit | Api | Middlewares', () => {
  describe('#checkFormatForInputPseudo', () => {
    let req, res, next
    beforeEach(() => {
      req = {
        body: {}
      }
      res = {
        status: function (code) {
          this.status = code
          return this
        },
        send: function (obj) {
          this.message = obj.message
          return this
        }
      }

      next = sinon.spy(checkFormatForInputPseudo.next)
    })

    afterEach(() => {
      sinon.restore()
    })

    it('should send 403 status on invalid pseudo format', () => {
      // given
      req.body = {
        pseudo: 'to'
      }

      // when
      checkFormatForInputPseudo(req, res, next)

      // then
      expect(next.called).to.equal(false)
      expect(res.status).to.equal(403)
      expect(res.message).to.equal('Invalid pseudo format')
    })

    it('should call next() on valid pseudo format', () => {
      // given
      req.body = {
        pseudo: 'Amoxi'
      }

      // when
      checkFormatForInputPseudo(req, res, next)

      // then
      expect(next.called).to.equal(true)
    })
  })
  describe('#checkFormatAndHashInputPassword', () => {
    let req, res, next
    beforeEach(() => {
      req = {
        body: {}
      }
      res = {
        status: function (code) {
          this.status = code
          return this
        },
        send: function (obj) {
          this.message = obj.message
          return this
        }
      }

      next = sinon.spy(checkFormatAndHashInputPassword.next)
    })

    afterEach(() => {
      sinon.restore()
    })

    it('should send 403 status on invalid password format', async () => {
      // given
      req.body = {
        password: 'password'
      }

      // when
      await checkFormatAndHashInputPassword(req, res, next)

      // then
      expect(next.called).to.equal(false)
      expect(res.status).to.equal(403)
      expect(res.message).to.equal('Password weak')
    })

    it('should call next() on valid password format', async () => {
      // given
      req.body = {
        password: 'Tatayoyo1!'
      }

      // when
      await checkFormatAndHashInputPassword(req, res, next)

      // then
      expect(next.called).to.equal(true)
    })

    it('should replace the given password by a bcrypt hash', async () => {
      // given
      const inputPassword = 'Tatayoyo1!'
      req.body = {
        password: inputPassword
      }

      // when
      await checkFormatAndHashInputPassword(req, res, next)

      const isNewReqPasswordABcryptHash = await bcrypt.compare(inputPassword, req.body.password)

      // then
      expect(req.body.password).to.not.equal(inputPassword)
      expect(isNewReqPasswordABcryptHash).to.equal(true)
    })
  })
})
