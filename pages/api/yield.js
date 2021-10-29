import redis from '../../db/redis'

const numberOfDays = timeFrame => {
  const days = parseInt(timeFrame)
  return isFinite(days) ? days : undefined
}

const yieldDateIsWithin = (days, _yield) => days
  ? new Date(_yield.date).getTime() > new Date().setDate(new Date().getDate() - days)
  : true

const assetsOf = _yield =>
  Object.keys(_yield).filter(k => k != 'date');


export default async function getYield(req, res) {

  const xAxisTicks = []
  const allAssets = new Set()
  const maxDays = numberOfDays(req.query.timeFrame)

  const yields = (await redis.lrange('yields', 0, -1))
    .map(yieldString => JSON.parse(yieldString))
    .filter(_yield => yieldDateIsWithin(maxDays, _yield))
    .map(_yield => {

      const date = new Date(_yield.date)

      // add assets to the allAssets set
      assetsOf(_yield).forEach(asset => allAssets.add(asset))

      // convert date to unix timestamp
      _yield.date = date.getTime()

      // X-Axis ticks consist of 1st and 15th of the month
      if (date.getDate() == 1 || date.getDate() == 15) {
        xAxisTicks.push(_yield.date)
      }

      return _yield
    })

  res.status(200).json({
    yields: yields,
    xTicks: xAxisTicks,
    assets: [...allAssets].sort()
  })
}
