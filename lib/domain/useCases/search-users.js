const NotFound = require('../models/ApiResponse')
const ApiResponse = require('../models/ApiResponse')

module.exports = async function searchUsers ({
  searchInput,
  userRepository
}) {
  const searchResult = await userRepository.searchUsersByRegex(searchInput)
  const response = searchResult.length
    ? new ApiResponse({ statusCode: 200, payload: searchInput })
    : new NotFound()
  return response
}
