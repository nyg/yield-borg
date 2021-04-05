import got from 'got'
import redis from '../../db/redis'


export default async (req, res) => {

  if (req.headers.authorization !== `Bearer ${process.env.CRON_KEY}`) {
    res.status(403).end()
    return
  }

  const json = await got('https://swissborg-api-proxy.swissborg-stage.workers.dev/chsb').json()

  /* Check if an update has already been done for today. */

  const today = new Date().toLocaleDateString('en-GB')
  const lastYields = JSON.parse(await redis.lrange('yields', -1, -1))

  if (lastYields.date == today) {
    res.status(200).json({ status: "yields already updated" })
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
  }, {})

  /* Insert new yields into the database */

  // the problem is that we can't rely on json.timestamp or
  // json.updatedtime, so we compare the current yields with the
  // previous ones and only insert them into the db if they are
  // different (we assume the probability that all yields are the
  // same twice in a row is very low)

  delete lastYields.date
  if (JSON.stringify(lastYields) != JSON.stringify(yields)) {
    yields.date = today
    await redis.rpush('yields', JSON.stringify(yields))
    res.status(200).json({ status: 'success' })
  }
  else {
    res.status(200).json({ status: 'yields not yet updated on webpage' })
  }
}
