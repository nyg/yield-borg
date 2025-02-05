import got from 'got'
import { pgSql } from '../../../db/db'
import { toISODate } from '../../../utils/utils'


export default async function fetchAndStoreNewYields(req, res) {

   if (req.method !== 'POST') {
      res.status(405).send({ message: 'Only POST requests allowed' })
      return
   }

   /* Check if today's yields have already been inserted */

   const today = toISODate(new Date())
   const lastYieldDate = (await pgSql`select date from yields order by date desc limit 1`)[0].date

   if (toISODate(lastYieldDate) == today) {
      res.status(200).json({ status: 'yields already inserted' })
      return
   }

   /* Fetch existing earn strategies */

   const strategies = await pgSql`select * from earn_strategies where active = true`
   const strategyIdByProduct = strategies.reduce((map, strategy) => {
      map[strategy.product] = strategy.id
      return map
   }, {})

   /* Fetch yields */

   const yieldResponse = await got('https://swissborg.com/page-data/sq/d/3223044680.json').json()
   const yields = yieldResponse.data.earnStrategies.items.filter(item => item.isActive)

   const databaseYields = []
   for (const item of yields) {

      let strategyId = strategyIdByProduct[item.product]
      if (strategyId == null) {
         const newStrategy = {
            currency: item.currency,
            active: true,
            protocol: item.protocol,
            name: `${item.currency} (${item.protocol})`,
            product: item.product,
            'start_date': item.startDate
         }

         try {
            strategyId = (await pgSql`insert into earn_strategies ${pgSql(newStrategy)} returning id`)[0].id
            console.log(`New strategy inserted: ${strategyId}`)
         }
         catch (error) {
            if (error.code === '23505') {
               console.warn('Duplicate entry detected:', error.detail)
            }
            else {
               throw e
            }
         }
      }

      databaseYields.push({
         'earn_strategy': strategyId,
         date: today,
         value: item.currentApy
      })
   }

   /* Insert yields */

   const insertedYields = await pgSql`insert into yields ${pgSql(databaseYields)} returning *`

   res.status(200).json({
      yields: insertedYields,
      swissborg: yieldResponse
   })
}
