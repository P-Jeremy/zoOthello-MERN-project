// Chai
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))
chai.use(require('chai-sorted'))
// Sinon
const sinon = require('sinon')
chai.use(require('sinon-chai'))
// Other
const checkPseudoFormat = require('./../../../../../application/utils/middlewares')

describe('Unit | Api | Middlewares | checkPseudoFormat', () => {
  describe('#checkPseudoFormat', () => {
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

      next = sinon.spy(checkPseudoFormat.next)
      next = sinon.spy(checkPseudoFormat.next)
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
      checkPseudoFormat(req, res, next)

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
      checkPseudoFormat(req, res, next)

      // then
      expect(next.called).to.equal(true)
    })
  })
})
