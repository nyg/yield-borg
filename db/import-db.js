const fs = require('fs').promises
const Redis = require('ioredis');

(async () => {

  // get redis url
  const data = await fs.readFile('.env.development.local', 'ascii')
  const redisUrl = data.split('\n').filter(l => l.match(/^REDIS_URL=/))[0].split('=')[1]

  // read yields from file
  const yields = JSON.parse(await fs.readFile('db/yields.json'))

  // import yields into db
  const redis = new Redis(redisUrl)
  await redis.rpush('yields', yields.map(JSON.stringify))
  redis.quit()

  console.log('Import done.')
})()
