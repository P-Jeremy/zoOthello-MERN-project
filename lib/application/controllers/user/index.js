const express = require('express')
const router = express.Router()
const UserController = require('./user-controller')
const { checkFormatAndHashInputPassword, checkFormatForInputPseudo } = require('../../utils/middlewares.js')

router.post('/search', UserController.searchUsers)

router.post('/', checkFormatAndHashInputPassword, checkFormatForInputPseudo, UserController.addUser)

router.post('/signIn', UserController.signIn)

router.get('/:id', UserController.getUserInfos)

module.exports = router
