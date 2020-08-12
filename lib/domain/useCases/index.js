const dependencies = {
  userRepository: require('../../infrasctucture/repositories/user-repository')
}

const { injectDependencies } = require('../../infrasctucture/utils/dependency-injection')

module.exports = injectDependencies({
  registerNewUser: require('./register-new-user')
}, dependencies)
