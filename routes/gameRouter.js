const express = require('express')
const router = express.Router()
const GameController = require('../controllers/gameController')

/** New instance of GameController */
const controller = new GameController()

/** GET ALL GAMES */
router.get('/', controller.getGames)

/** GET ONE GAME */
router.get('/one/:id', controller.getGame)

/** ADD A GAME */
router.post('/', controller.addGame)

/** UPDATE A GAME */
router.put('/:id', controller.updateGame)

/** UPDATE A GAME TO A NEW ONE  */
router.put('/newGame/:id', controller.newGame)

/** DELETE A GAME WITH ITS OWN ID */
router.delete('/delete/:id', controller.delete)

module.exports = router
