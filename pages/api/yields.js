import redis from '../../db/redis'

export default async (req, res) => {

  const allAssets = new Set()
  const xAxisTicks = []

  const yields = (await redis.lrange('yields', 0, -1)).map(yieldString => {

    const _yield = JSON.parse(yieldString)

    // add assets to the allAssets set
    Object
      .keys(_yield)
      .filter(key => key != 'date')
      .forEach(asset => allAssets.add(asset))

    // convert date to unix timestamp
    const dateParts = _yield.date.split('/').map(s => parseInt(s))
    const date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0], 9, 0, 0)
    _yield.date = date.getTime()

    // X-Axis ticks consist of 1st and 15th of the month
    if (date.getDate() == 1 || date.getDate() == 15) {
      xAxisTicks.push(_yield.date)
    }

    return _yield
  })

  res.status(200).json({
    status: 'success',
    yields: yields,
    xTicks: xAxisTicks,
    assets: [...allAssets].sort()
  })
}
