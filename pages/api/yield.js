import { pgSql } from '../../db/db'
import { assetsOf } from '../../utils/utils'

const numberOfDays = timeFrame => {
   const days = parseInt(timeFrame)
   return isFinite(days) ? days : 100 * 365
}

const findYieldsSince = async since =>
   await pgSql`
   select y.date, y.value, s.name
     from yields y
    inner join earn_strategies s on y.earn_strategy = s.id
    where s.active = true
      and y.date > ${since}`


export default async function getYield(req, res) {

   const xAxisTicks = []
   const allAssets = new Set()
   const maxDays = numberOfDays(req.query.timeFrame)

   const startDate = new Date()
   startDate.setDate(startDate.getDate() - maxDays)

   const yieldsByDate = (await findYieldsSince(startDate))
      .reduce((prev, curr) => {
         prev[curr.date] ??= { date: curr.date }
         prev[curr.date][curr.name] = curr.value
         return prev
      }, {})

   const yields = Object
      .values(yieldsByDate)
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
