module.exports = async function getOneGame ({
  gameId,
  gameRepository,
  userRepository
}) {
  const gameData = await gameRepository.getGameDatas(gameId)
  const whitePlayerData = await userRepository.getUserInfos({ _id: gameData.whitePlayer })
  const blackPlayerData = await userRepository.getUserInfos({ _id: gameData.blackPlayer })

  return {
    gameData,
    whitePlayerData,
    blackPlayerData
  }
}
