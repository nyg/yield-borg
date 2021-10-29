const fs = require('fs')
const Redis = require('ioredis')
const prompt = require('prompt-sync')();

(async () => {

  // get redis url
  const data = fs.readFileSync('.env.development.local', 'ascii')
  const redisUrl = data.split('\n').filter(l => l.match(/^REDIS_URL=/))[0].split('=')[1]

  // avoid erasing prod db…
  console.warn(`You're going to drop database ${redisUrl} and import data.json into it.`)
  const answer = prompt('Are you sure? (yes/N) ')
  if (answer !== 'yes') {
    console.log('Exiting…')
    process.exit(1)
  }

  // read yields and community indices from file
  const { yields, averages, communityIndices } = JSON.parse(fs.readFileSync('db/data.json'))

  // import values into db
  const redis = new Redis(redisUrl)

  await redis.del('yields')
  await redis.rpush('yields', yields)

  await redis.del('averages')
  await redis.rpush('averages', averages)

  await redis.del('communityIndices')
  await redis.rpush('communityIndices', communityIndices)

  redis.quit()

  console.log('Import done.')
})()
