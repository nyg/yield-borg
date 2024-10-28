import { redis } from '../../db/redis'
import { assetsOf } from '../../utils/utils'


export default async function getYieldAverage(req, res) {

   const allAssets = new Set()

   const yieldAverages = (await redis.lrange('averages', 0, -1))
      .map(data => {
         const yieldAverage = JSON.parse(data)

         // replace date by timestamp
         yieldAverage.date = new Date(`${yieldAverage.date}-01`).getTime()

         // build set of distinct assets
         assetsOf(yieldAverage).forEach(asset => allAssets.add(asset))

         return yieldAverage
      })

   res.status(200).json({
      yieldAverages,
      assets: [...allAssets].sort()
   })
}
