const express = require('express')
const router = express.Router()
const GameController = require('./game-controller')

router.get('/', GameController.getGames)

router.get('/one/:id', GameController.getGame)

router.get('/user/:id', GameController.getUserGames)

router.post('/', GameController.addGame)

router.put('/:id', GameController.updateGame)

router.put('/resetGame/:id', GameController.resetGame)

router.delete('/delete/:id', GameController.delete)

module.exports = router
