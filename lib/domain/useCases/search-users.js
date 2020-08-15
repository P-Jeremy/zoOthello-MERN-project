const NotFound = require('../models/NotFound')

module.exports = async function searchUsers ({
  search,
  userRepository
}) {
  const searchResult = await userRepository.searchUsersByRegex(search)
  const response = searchResult.payload.length > 0
    ? searchResult
    : new NotFound()

  return response
}
