const fs = require('fs')
const Redis = require('ioredis');

(async () => {

  // get redis url
  const data = fs.readFileSync('.env.development.local', 'ascii')
  const redisUrl = data.split('\n').filter(l => l.match(/^REDIS_URL=/))[0].split('=')[1]

  // get yields, yield averages and community indices
  const redis = new Redis(redisUrl)
  const yields = await redis.lrange('yields', 0, -1)
  const averages = await redis.lrange('averages', 0, -1)
  const communityIndices = await redis.lrange('communityIndices', 0, -1)
  redis.quit()

  // save yields to file
  fs.writeFileSync('db/data.json', JSON.stringify({
    yields,
    averages,
    communityIndices
  }, null, '\t'))

  console.log('Export done.')
})()
