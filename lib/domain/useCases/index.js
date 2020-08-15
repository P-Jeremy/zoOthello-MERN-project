const dependencies = {
  userRepository: require('../../infrasctucture/repositories/user-repository'),
  userService: require('../services/user-service')
}

const { injectDependencies } = require('../../infrasctucture/utils/dependency-injection')

module.exports = injectDependencies({
  registerNewUser: require('./register-new-user'),
  searchUSers: require('./search-users')
}, dependencies)
