import redis from '../../db/redis'

export default async (req, res) => {

  const assets = new Set() // set of distinct assets present in the db

  const yields = (await redis.lrange('yields', 0, -1)).map(s => {

    const y = JSON.parse(s)

    // convert date to unix timestamp
    const date = y.date.split('/').map(s => parseInt(s))
    y.date = new Date(date[2], date[1] - 1, date[0], 9, 0, 0).getTime()

    // add all assets to assets set
    Object.keys(y).forEach(k => assets.add(k))
    return y
  })

  assets.delete('date')

  res.status(200).json({
    status: 'success',
    yields: yields,
    assets: Array.from(assets).sort()
  })
}
