import got from 'got'
import redis from '../../../db/redis'
import { assetsOf, asyncForEachKeyOf, forEachKeyOf } from '../../../utils/utils'

const initialBalance = 1


export default async function computeYieldAverages(req, res) {

  /* Retrieve all yields from db and group them by month and asset. */

  const yields = (await redis.lrange('yields', 0, -1)).map(JSON.parse)
  const groupedYields = yields.reduce((groupedYields, _yield) => {

    const month = _yield.date.substring(0, 7)
    groupedYields[month] ??= {}

    assetsOf(_yield).forEach(asset => {
      groupedYields[month][asset] ??= []
      groupedYields[month][asset].push({ date: _yield.date, value: _yield[asset] })
    })

    return groupedYields
  }, {})

  /* For each monthn and asset, compute the average APY. */

  forEachKeyOf(groupedYields, month => {

    const year = parseInt(month.substring(0, 4))
    const isLeapYear = !(year & 3 || !(year % 25) && year & 15)

    // interests are compounded daily
    const periodCount = isLeapYear ? 366 : 355

    forEachKeyOf(groupedYields[month], asset => {

      // Find out how much money would be earned at the end of the month if the
      // initial balance was 1.
      groupedYields[month][asset] = groupedYields[month][asset]
        .reduce((acc, _yield) => {

          const apr = periodCount * (Math.pow(_yield.value / 100 + 1, 1 / periodCount) - 1)
          const dailyInterest = apr * acc.finalBalance / periodCount

          acc.finalBalance += dailyInterest
          acc.dayCount++

          return acc
        }, { finalBalance: initialBalance, dayCount: 0 })

      // Using the compounding interest function, compute the APR for the month
      // and then convert it to APY.
      const { finalBalance, dayCount } = groupedYields[month][asset]
      const apr = periodCount * (Math.pow(finalBalance / initialBalance, 1 / dayCount) - 1)
      const apy = Math.pow(apr / periodCount + 1, periodCount) - 1

      groupedYields[month][asset] = apy
    })
  })

  /* Store computed APY averages into db. */

  // TODO don't recompute already computed averages (-:
  await redis.del('averages')

  await asyncForEachKeyOf(groupedYields, async month => {
    await redis.lpush('averages', JSON.stringify({
      date: month,
      ...groupedYields[month]
    }))
  })

  res.status(200).json({ status: 'success' })
}
