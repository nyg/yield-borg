import redis from '../../utils/redis'

export default async (req, res) => {

  const assets = new Set() // set of distinct assets present in the db
  const yields = (await redis.lrange('yields', 0, -1))
    .map(s => {
      try {
        const y = JSON.parse(s)
        Object.keys(y).forEach(k => assets.add(k))
        return y
      }
      catch (err) {
        return null
      }
    })
    .filter(y => y != null)

  assets.delete('date')

  res.status(200).json({
    status: 'success',
    yields: yields,
    assets: Array.from(assets).sort()
  })
}
