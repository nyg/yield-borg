import got from 'got'
import redis from '../../utils/redis'


export default async (req, res) => {

  if (req.headers.authorization !== `Bearer ${process.env.CRON_KEY}`) {
    res.status(403).end()
    return
  }

  const json = await got('https://swissborg-api-proxy.swissborg-stage.workers.dev/chsb').json()

  /* Check if an update has already been done for today. */

  const today = new Date(json.timestamp.replace(' ', 'T')).toLocaleDateString('en-GB')
  const lastUpdate = await redis.get('lastUpdate')

  if (lastUpdate == today) {
    res.status(200).json({ status: "error, yields already updated" })
    return
  }

  /* Get yields. */

  // get keys containing premium yields
  const keys = Object.keys(json).filter(k => k.match(/-current-premium-yield$/))

  // extract yields into object
  const yields = keys.reduce((yields, key) => {

    const assetName = key.split('-')[0].toUpperCase()
    const yieldPercentage = parseFloat(json[key].replace(/Premium (.*?)% p.a./, '$1'))
    yields[assetName] = yieldPercentage

    return yields
  }, { date: today })

  /* Insert new yields into database */

  await redis.rpush('yields', JSON.stringify(yields))
  await redis.set('lastUpdate', today)

  res.status(200).json({ status: 'success' })
}
