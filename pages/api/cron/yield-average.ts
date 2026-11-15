import type { NextApiRequest, NextApiResponse } from 'next'

import { pgSql } from '@/lib/db'

type Strategy = { id: number, name: string }
type YieldRow = { date: Date, value: string, name: string }

const isLeapYear = (year: number) => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)

const averageApy = (apys: number[], periodCount: number) => {
   const finalBalance = apys.reduce((balance, apy) => {
      const apr = periodCount * (Math.pow(apy / 100 + 1, 1 / periodCount) - 1)
      return balance + apr * balance / periodCount
   }, 1)

   const apr = periodCount * (Math.pow(finalBalance, 1 / apys.length) - 1)
   return Math.pow(apr / periodCount + 1, periodCount) - 1
}

export default async function updateYieldAverages(req: NextApiRequest, res: NextApiResponse) {
   if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Only POST requests allowed' })
   }
   if (!pgSql) {
      return res.status(503).json({ message: 'Database not configured' })
   }

   const strategies = await pgSql<Strategy[]>`select id, name from earn_strategies`
   const strategyIdByName = new Map(strategies.map(strategy => [strategy.name, strategy.id]))

   const yields = await pgSql<YieldRow[]>`
      select y.date, y.value, s.name
        from yields y
       inner join earn_strategies s on y.earn_strategy = s.id`

   const apysByMonthAndStrategy = new Map<string, Map<string, number[]>>()
   for (const row of yields) {
      const month = row.date.toISOString().substring(0, 7)
      const apysByStrategy = apysByMonthAndStrategy.get(month) ?? new Map<string, number[]>()
      const apys = apysByStrategy.get(row.name) ?? []
      apys.push(Number(row.value))
      apysByStrategy.set(row.name, apys)
      apysByMonthAndStrategy.set(month, apysByStrategy)
   }

   const yieldAverages = [...apysByMonthAndStrategy].flatMap(([month, apysByStrategy]) => {
      const periodCount = isLeapYear(parseInt(month.substring(0, 4))) ? 366 : 365

      return [...apysByStrategy].flatMap(([strategy, apys]) => {
         const strategyId = strategyIdByName.get(strategy)
         return strategyId === undefined ? [] : [{
            earn_strategy: strategyId,
            date: `${month}-01`,
            value: averageApy(apys, periodCount),
         }]
      })
   })

   await pgSql`delete from yield_averages`
   await pgSql`insert into yield_averages ${pgSql(yieldAverages)}`

   res.status(200).json({ status: 'success' })
}
