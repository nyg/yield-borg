import { pgSql } from '../../../db/db'
import { asyncForEachKeyOf, forEachKeyOf } from '../../../utils/utils'


export default async function updateYieldAverages(req, res) {

   if (req.method !== 'POST') {
      res.status(405).send({ message: 'Only POST requests allowed' })
      return
   }

   /* Fetch existing earn strategies */

   const strategies = await pgSql`select id, name from earn_strategies`
   const strategyIdByName = strategies.reduce((map, strategy) => {
      map[strategy.name] = strategy.id
      return map
   }, {})

   /* Retrieve all yields from db and group them by month and strategy. */

   const yields = await pgSql`
      select y.date, y.value, s.name
        from yields y
       inner join earn_strategies s on y.earn_strategy = s.id`

   const groupedYields = yields.reduce((groupedYields, _yield) => {

      const month = _yield.date.toISOString().substring(0, 7)
      groupedYields[month] ??= {}

      groupedYields[month][_yield.name] ??= []
      groupedYields[month][_yield.name].push({ date: _yield.date, value: _yield.value })

      return groupedYields
   }, {})

   /* For each month and asset, compute the average APY. */

   const initialBalance = 1

   forEachKeyOf(groupedYields, month => {

      const year = parseInt(month.substring(0, 4))
      const isLeapYear = !(year & 3 || !(year % 25) && year & 15)

      // interests are compounded daily
      const periodCount = isLeapYear ? 366 : 355

      forEachKeyOf(groupedYields[month], strategy => {

         // Find out how much money would be earned at the end of the month if the
         // initial balance was 1.
         groupedYields[month][strategy] = groupedYields[month][strategy]
            .reduce((acc, _yield) => {

               const apr = periodCount * (Math.pow(_yield.value / 100 + 1, 1 / periodCount) - 1)
               const dailyInterest = apr * acc.finalBalance / periodCount

               acc.finalBalance += dailyInterest
               acc.dayCount++

               return acc
            }, { finalBalance: initialBalance, dayCount: 0 })

         // Using the compounding interest function, compute the APR for the month
         // and then convert it to APY.
         const { finalBalance, dayCount } = groupedYields[month][strategy]
         const apr = periodCount * (Math.pow(finalBalance / initialBalance, 1 / dayCount) - 1)
         const apy = Math.pow(apr / periodCount + 1, periodCount) - 1

         groupedYields[month][strategy] = apy
      })
   })

   /* Store computed APY averages into db. */

   // TODO don't recompute already computed averages (:
   await pgSql`delete from average_yields`

   await asyncForEachKeyOf(groupedYields, async month => {
      await asyncForEachKeyOf(groupedYields[month], async strategy => {
         await pgSql`insert into average_yields ${pgSql({
            'earn_strategy': strategyIdByName[strategy],
            date: month,
            value: groupedYields[month][strategy]
         })}`
      })
   })

   res.status(200).json({ status: 'success' })
}
