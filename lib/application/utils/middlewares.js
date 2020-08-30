const validPseudo = /^[A-z0-9_-]{3,15}$/
const validPassword = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/

const checkPseudoFormat = (req, res, next) => {
  const isFormatValid = validPseudo.test(req.body.pseudo)
  if (!isFormatValid) {
    return res.status(403).send({ message: 'Invalid pseudo format' })
  }

  next()
}

const checkPasswordFormat = (req, res, next) => {
  const isFormatValid = validPassword.test(req.body.password)
  if (!isFormatValid) {
    return res.status(403).send({ message: 'Password weak' })
  }

  next()
}

module.exports = { checkPseudoFormat, checkPasswordFormat }
