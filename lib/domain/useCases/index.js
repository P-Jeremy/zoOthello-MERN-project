const dependencies = {
  userRepository: require('../../infrasctucture/repositories/user-repository')
}

const { injectDependencies } = require('../../infrasctucture/utils/dependency-injection')

module.exports = injectDependencies({
  getUserInfos: require('./get-user-infos'),
  registerNewUser: require('./register-new-user'),
  searchUsers: require('./search-users'),
  signIn: require('./sign-in')
}, dependencies)
