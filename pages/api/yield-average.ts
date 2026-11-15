import type { NextApiRequest, NextApiResponse } from 'next'

import { pgSql } from '@/lib/db'
import type { AssetValues, YieldAverageResponse } from '@/types/api'

type AverageRow = { date: Date, value: string, name: string }

export default async function getYieldAverage(_req: NextApiRequest, res: NextApiResponse<YieldAverageResponse>) {
   if (!pgSql) {
      return res.status(200).json({ yieldAverages: [], assets: [] })
   }

   const rows = await pgSql<AverageRow[]>`
      select a.date, a.value, s.name
        from yield_averages a
       inner join earn_strategies s
          on a.earn_strategy = s.id
       order by date desc`

   const averagesByMonth = new Map<string, AssetValues>()
   const assets = new Set<string>()

   for (const row of rows) {
      const month = row.date.toISOString().substring(0, 7)
      const values = averagesByMonth.get(month) ?? { date: row.date.getTime() }
      values[row.name] = row.value
      averagesByMonth.set(month, values)
      assets.add(row.name)
   }

   res.status(200).json({
      yieldAverages: [...averagesByMonth.values()],
      assets: [...assets].sort(),
   })
}
