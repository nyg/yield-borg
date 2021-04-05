const fs = require('fs').promises
const Redis = require('ioredis');

(async () => {

  // get redis url
  const data = await fs.readFile('.env.development.local', 'ascii')
  const redisUrl = data.split('\n').filter(l => l.match(/^REDIS_URL=/))[0].split('=')[1]

  // get all yields
  const redis = new Redis(redisUrl)
  const yields = await redis.lrange('yields', 0, -1)
  redis.quit()

  // save yields to file
  await fs.writeFile('db/yields.json', JSON.stringify(yields))
  console.log('Export done.')
})()
