const validPseudo = /^[A-z0-9_-]{3,15}$/

const checkPseudoFormat = (req, res, next) => {
  const isFormatValid = validPseudo.test(req.body.pseudo)
  if (!isFormatValid) {
    return res.status(403).send({ message: 'Invalid pseudo format' })
  }

  next()
}

module.exports = checkPseudoFormat
