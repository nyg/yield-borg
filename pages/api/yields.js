import Redis from 'ioredis'

export default async (req, res) => {

  const redis = new Redis(process.env.REDIS_URL)
  const yields = (await redis.lrange('yields', 0, -1))
    .map(s => {
      try {
        return JSON.parse(s)
      }
      catch (err) {
        return null
      }
    })
    .filter(y => y != null)

  res.status(200).json({
    status: 'success',
    yields: yields
  })
}
