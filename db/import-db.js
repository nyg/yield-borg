const fs = require('fs').promises
const Redis = require('ioredis');

(async () => {

  // get redis url
  const data = await fs.readFile('.env.development.local', 'ascii')
  const redisUrl = data.split('\n').filter(l => l.match(/^REDIS_URL=/))[0].split('=')[1]

  // read yields and community indices from file
  const { yields, communityIndices } = JSON.parse(await fs.readFile('db/export.json'))

  // import values into db
  const redis = new Redis(redisUrl)

  await redis.del('yields')
  await redis.rpush('yields', yields)

  await redis.del('communityIndices')
  await redis.rpush('communityIndices', communityIndices)

  redis.quit()

  console.log('Import done.')
})()
