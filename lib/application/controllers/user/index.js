const express = require('express')
const router = express.Router()
const UserController = require('./user-controller')
const checkPseudoFormat = require('../../utils/middlewares')

router.post('/search', UserController.searchUsers)

router.post('/', checkPseudoFormat, UserController.addUser)

router.post('/signIn', UserController.signIn)

router.get('/:id', UserController.getUserInfos)

module.exports = router
