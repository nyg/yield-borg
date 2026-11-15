import got from 'got'
import type { NextApiRequest, NextApiResponse } from 'next'

import { pgSql } from '@/lib/db'

type Strategy = { id: number, product: string }

type EarnStrategyItem = {
   product: string
   currency: string
   protocol: string
   startDate: string
   currentApy: number
   isActive: boolean
}

type EarnStrategiesResponse = {
   data: { earnStrategies: { items: EarnStrategyItem[] } }
}

type YieldToInsert = { earn_strategy: number, date: string, value: number }

const toISODate = (date: Date) => date.toISOString().substring(0, 10)

export default async function fetchAndStoreNewYields(req: NextApiRequest, res: NextApiResponse) {
   if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Only POST requests allowed' })
   }
   if (!pgSql) {
      return res.status(503).json({ message: 'Database not configured' })
   }

   const today = toISODate(new Date())
   const [lastYield] = await pgSql<{ date: Date }[]>`select date from yields order by date desc limit 1`

   if (lastYield && toISODate(lastYield.date) === today) {
      return res.status(200).json({ status: 'yields already inserted' })
   }

   const strategies = await pgSql<Strategy[]>`select * from earn_strategies where active = true`
   const strategyIdByProduct = new Map(strategies.map(strategy => [strategy.product, strategy.id]))

   const yieldResponse = await got('https://swissborg.com/page-data/sq/d/3223044680.json').json<EarnStrategiesResponse>()
   const apiYields = yieldResponse.data.earnStrategies.items.filter(item => item.isActive)

   const yieldsToInsert = new Map<number, YieldToInsert>()
   for (const item of apiYields) {
      let strategyId = strategyIdByProduct.get(item.product)
      if (strategyId == null) {
         const newStrategy = {
            currency: item.currency,
            active: true,
            protocol: item.protocol,
            name: `${item.currency} (${item.protocol})`,
            product: item.product,
            start_date: new Date(item.startDate),
         }

         const [insertedStrategy] = await pgSql<{ id: number }[]>`insert into earn_strategies ${pgSql(newStrategy)} returning id`
         if (!insertedStrategy) {
            throw new Error(`Strategy not inserted: ${item.product}`)
         }

         strategyId = insertedStrategy.id
         console.log(`New strategy inserted: ${strategyId}`)
      }

      if (yieldsToInsert.has(strategyId)) {
         console.warn('Duplicate product key in API response:', item)
      } else {
         yieldsToInsert.set(strategyId, {
            earn_strategy: strategyId,
            date: today,
            value: item.currentApy,
         })
      }
   }

   const insertedYields = await pgSql`insert into yields ${pgSql([...yieldsToInsert.values()])} returning *`

   res.status(200).json({
      yields: insertedYields,
      swissborg: yieldResponse,
   })
}
