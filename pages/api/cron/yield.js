import got from 'got'
import redis from '../../../db/redis'


export default async (req, res) => {

  if (req.headers.authorization !== `Bearer ${process.env.CRON_KEY}`) {
    res.status(403).end()
    return
  }

  const json = await got('https://swissborg-api-proxy.swissborg-stage.workers.dev/chsb').json()

  /* Check if an update has already been done for today. */

  const today = new Date().toISOString().substring(0, 10)
  const lastYields = JSON.parse(await redis.lrange('yields', -1, -1))

  if (lastYields.date == today) {
    res.status(200).json({ status: "yields already updated" })
    return
  }

  /* Extract yield percentages into object. */

  const yields = Object
    .keys(json.chsbOverviewV2)
    .filter(key => key.match(/CurrentPremiumYieldPercentage$/))
    .reduce((yields, key) => {
      const asset = key.match(/[a-z]+/)[0].toUpperCase()
      yields[asset] = json.chsbOverviewV2[key]
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
