const express = require('express')
const router = express.Router()
const GameController = require('./game-controller')

router.get('/', GameController.getGames)

router.get('/one/:id', GameController.getGame)

router.get('/user/:id', GameController.getUserGames)

router.post('/', GameController.addGame)

router.put('/update/pass/:id', GameController.updateGameOnPass)

router.put('/update/move/:id', GameController.updateGameOnMove)

router.put('/delete/:id', GameController.delete)

module.exports = router
