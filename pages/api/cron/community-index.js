import got from 'got'
import redis from '../../../db/redis'


export default async function retrieveCommunityIndex(req, res) {

  const html = await got('https://swissborg.com/chsb-overview')
  const groups = html.body.match(/<h3 class="sc-xuz9vd-2 dHQMed">(?<index>\d{1,2}\.\d)\/10<\/h3>/).groups

  // this script runs every Wednesday
  const date = new Date()
  date.setDate(date.getDate() - 1)

  await redis.rpush('communityIndices', JSON.stringify({
    date: date.toISOString().substring(0, 10),
    value: parseFloat(groups.index)
  }))

  res.status(200).json({ status: 'success' })
}
