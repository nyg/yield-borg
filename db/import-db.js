const fs = require('fs').promises
const Redis = require('ioredis')
const prompt = require('prompt-sync')();

(async () => {

  // get redis url
  const data = await fs.readFile('.env.development.local', 'ascii')
  const redisUrl = data.split('\n').filter(l => l.match(/^REDIS_URL=/))[0].split('=')[1]

  // avoid erasing prod db…
  console.warn(`You're going to drop database ${redisUrl} and import export.json into it.`)
  const answer = prompt('Are you sure? (yes/N) ')
  if (answer !== 'yes') {
    console.log('Exiting…')
    process.exit(1)
  }

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
