import got from 'got'
import redis from '../../../db/redis'


export default async function retrieveCommunityIndex(req, res) {

  const communityIndex = (await got('https://swissborg-api-proxy.swissborg-stage.workers.dev/chsb-v2')
    .json())
    .communityIndex

  // this script runs every Wednesday
  const tuesday = new Date()
  tuesday.setDate(tuesday.getDate() - 1)

  await redis.rpush('communityIndices', JSON.stringify({
    date: tuesday.toISOString().substring(0, 10),
    value: communityIndex
  }))

  res.status(200).json({ status: 'success' })
}
