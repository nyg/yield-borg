import redis from '../../db/redis'

export default async (req, res) => {

  const assets = new Set() // set of distinct assets present in the db
  const xTicks = []

  const yields = (await redis.lrange('yields', 0, -1)).map(s => {

    const y = JSON.parse(s)

    // convert date to unix timestamp
    const dateParts = y.date.split('/').map(s => parseInt(s))
    const date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0], 9, 0, 0)
    y.date = date.getTime()

    // X-Axis ticks consist of 1st and 15th of the month
    if (date.getDate() == 1 || date.getDate() == 15) {
      xTicks.push(y.date)
    }

    // add all assets to assets set
    Object.keys(y).forEach(k => assets.add(k))
    return y
  })

  assets.delete('date')

  res.status(200).json({
    status: 'success',
    yields: yields,
    xTicks: xTicks,
    assets: Array.from(assets).sort()
  })
}
