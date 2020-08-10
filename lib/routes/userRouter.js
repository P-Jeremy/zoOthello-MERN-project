const express = require('express')
const router = express.Router()
const UserController = require('../controllers/userController')

/** New instance of UserController */
const controller = new UserController()

/** SEARCH USERS CORRESPONDING DU FORM INPUT */
router.post('/search', controller.searchUsers)

/** ADD A USER */
router.post('/', controller.addUser)

/** SIGN IN */
router.post('/signIn', controller.signIn)

/** GET USER INFOS */
router.get('/:id', controller.getUserInfo)
module.exports = router
