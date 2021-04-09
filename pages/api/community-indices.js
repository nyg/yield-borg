import redis from '../../db/redis'

export default async (req, res) => {

  const communityIndices = (await redis.lrange('communityIndices', 0, -1)).map(s => {

    const y = JSON.parse(s)

    // convert date to unix timestamp
    const date = y.date.split('/').map(s => parseInt(s))
    y.date = new Date(date[2], date[1] - 1, date[0], 9, 0, 0).getTime()

    return y
  })

  res.status(200).json({
    status: 'success',
    communityIndices: communityIndices
  })
}
