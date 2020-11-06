const dependencies = {
  userRepository: require('../../infrasctucture/repositories/user-repository'),
  gameRepository: require('../../infrasctucture/repositories/game-repository'),
  gameService: require('../../infrasctucture/services/game-service')
}

const { injectDependencies } = require('../../infrasctucture/utils/dependency-injection')

module.exports = injectDependencies({
  getAllGames: require('./get-all-games'),
  getOneGame: require('./get-one-game'),
  getUserGames: require('./get-user-games'),
  getUserInfos: require('./get-user-infos'),
  registerNewUser: require('./register-new-user'),
  passTurn: require('./pass-turn'),
  searchUsers: require('./search-users'),
  signIn: require('./sign-in')
}, dependencies)
