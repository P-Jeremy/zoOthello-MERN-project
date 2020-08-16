const express = require('express')
const router = express.Router()
const UserController = require('./user-controller')

router.post('/search', UserController.searchUsers)

router.post('/', UserController.addUser)

router.post('/signIn', UserController.signIn)

router.get('/:id', UserController.getUserInfos)

module.exports = router
