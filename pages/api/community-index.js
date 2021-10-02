import redis from '../../db/redis'

export default async (req, res) => {

  const communityIndices = (await redis.lrange('communityIndices', 0, -1))
    .map(communityIndexString => {
      const communityIndex = JSON.parse(communityIndexString)
      communityIndex.date = new Date(communityIndex.date).getTime()
      return communityIndex
    })

  res.status(200).json({
    status: 'success',
    communityIndices: communityIndices
  })
}
