const dependencies = {
  userRepository: require('../../infrasctucture/repositories/user-repository'),
  userService: require('../services/user-service')
}

const { injectDependencies } = require('../../infrasctucture/utils/dependency-injection')

module.exports = injectDependencies({
  getUserInfos: require('./get-user-infos'),
  registerNewUser: require('./register-new-user'),
  searchUsers: require('./search-users')
}, dependencies)
