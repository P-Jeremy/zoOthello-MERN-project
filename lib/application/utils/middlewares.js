const bcrypt = require('bcryptjs')

const validPseudo = /^[A-z0-9_-]{3,15}$/
const validPassword = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/

const checkFormatForInputPseudo = (req, res, next) => {
  const isFormatValid = validPseudo.test(req.body.pseudo)
  if (!isFormatValid) {
    return res.status(403).send({ message: 'Invalid pseudo format' })
  }

  next()
}

const checkFormatAndHashInputPassword = async (req, res, next) => {
  const isFormatValid = validPassword.test(req.body.password)
  if (!isFormatValid) {
    return res.status(403).send({ message: 'Password weak' })
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  req.body.password = hashedPassword

  next()
}

module.exports = { checkFormatForInputPseudo, checkFormatAndHashInputPassword }
