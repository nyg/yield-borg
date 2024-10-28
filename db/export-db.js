const fs = require('fs')
const Redis = require('ioredis')

// create redis connection
const data = fs.readFileSync('.env.development.local', 'ascii')
const redisUrl = data.split('\n').filter(l => l.match(/^REDIS_URL=/))[0].split('=')[1]
const redis = new Redis(redisUrl)

   ;
(async () => {

   // get yields, yield averages and community indices
   const yields = await fetchRows('yields')
   const averages = await fetchRows('averages')
   const communityIndices = await fetchRows('communityIndices')
   redis.quit()

   // save yields to file
   fs.writeFileSync('db/data.json', JSON.stringify({
      yields,
      averages,
      communityIndices
   }, null, '\t'))

   console.log('Export done.')
})()


async function fetchRows(list, limit = 1000) {

   let start = 0, end = limit - 1
   let allRows = []

   while (true) {
      const rows = await redis.lrange(list, start, end)
      allRows = allRows.concat(rows)

      start += limit
      end += limit

      if (rows.length === 0) {
         break
      }
   }

   return allRows
}
