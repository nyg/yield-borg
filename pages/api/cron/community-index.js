import got from 'got'
import redis from '../../../db/redis'


export default async (req, res) => {

  if (req.headers.authorization !== `Bearer ${process.env.CRON_KEY}`) {
    res.status(403).end()
    return
  }

  const html = await got('https://swissborg.com/chsb-overview')
  const groups = html.body.match(/<h3 class="xuz9vd-2 bGLpAH">(?<index>\d{1,2}\.\d)\/10<\/h3>/).groups

  // this script runs every Wednesday
  const date = new Date()
  date.setDate(date.getDate() - 1)

  await redis.rpush('communityIndices', JSON.stringify({
    date: date.toISOString().substring(0, 10),
    value: parseFloat(groups.index)
  }))

  res.status(200).json({ status: 'success' })
}
