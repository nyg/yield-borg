import type { NextApiRequest, NextApiResponse } from 'next'

import { pgSql } from '@/lib/db'
import type { AssetValues, YieldResponse } from '@/types/api'

type YieldRow = { date: Date, value: string, name: string }

const numberOfDays = (timeFrame: string | string[] | undefined) => {
   const days = parseInt(String(timeFrame))
   return isFinite(days) ? days : 100 * 365
}

const isTickDay = (timestamp: number) => [1, 15].includes(new Date(timestamp).getDate())

export default async function getYield(req: NextApiRequest, res: NextApiResponse<YieldResponse>) {
   if (!pgSql) {
      return res.status(200).json({ yields: [], xTicks: [], assets: [] })
   }

   const startDate = new Date()
   startDate.setDate(startDate.getDate() - numberOfDays(req.query.timeFrame))

   const rows = await pgSql<YieldRow[]>`
      select y.date, y.value, s.name
        from yields y
       inner join earn_strategies s on y.earn_strategy = s.id
       where s.active = true
         and y.date > ${startDate}
       order by y.date`

   const yieldsByDate = new Map<number, AssetValues>()
   const assets = new Set<string>()

   for (const row of rows) {
      const date = row.date.getTime()
      const values = yieldsByDate.get(date) ?? { date }
      values[row.name] = row.value
      yieldsByDate.set(date, values)
      assets.add(row.name)
   }

   res.status(200).json({
      yields: [...yieldsByDate.values()],
      xTicks: [...yieldsByDate.keys()].filter(isTickDay),
      assets: [...assets].sort(),
   })
}
