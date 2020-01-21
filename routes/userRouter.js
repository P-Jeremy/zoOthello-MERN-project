const express = require('express')
const router = express.Router()
const UserController = require('../controllers/userController')

/** New instance of UserController */
const controller = new UserController()

// /** GET ALL GAMES */
// router.get('/', controller.)

// /** GET ONE GAME */
// router.get('/one/:id', controller.getGame)

/** ADD A USER */
router.post('/', controller.addUser)

/** SIGN IN */
router.post('/signIn', controller.signIn)

// /** UPDATE A GAME */
// router.put('/:id', controller.updateGame)

// /** UPDATE A GAME TO A NEW ONE  */
// router.put('/newGame/:id', controller.newGame)

// /** DELETE A GAME WITH ITS OWN ID */
// router.delete('/delete/:id', controller.delete)

module.exports = router
