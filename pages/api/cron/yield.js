import got from 'got'
import redis from '../../../db/redis'


export default async function retrieveYields(req, res) {

  /* Check if an update has already been done for today. */

  const today = new Date().toISOString().substring(0, 10)
  const lastYields = JSON.parse(await redis.lrange('yields', -1, -1))

  if (lastYields.date == today) {
    res.status(200).json({ status: "yields already updated" })
    return
  }

  /* Extract yield percentages into object. */

  const json = await got('https://swissborg-api-proxy.swissborg-stage.workers.dev/chsb-v2').json()
  const yields = Object
    .keys(json)
    .filter(key => key.match(/CurrentPremiumYieldPercentage$/))
    .reduce((yields, key) => {
      const asset = key.match(/[a-z]+/)[0].toUpperCase()
      yields[asset] = json[key]
      return yields
    }, {})

  /* Insert new yields into the database */

  // Yields are updated once per day, but we don't know when (we can't rely on
  // json.timestamp or json.updatedtime).
  //
  // If the yields are different from the previous ones, we assume they have
  // been updated and insert them into the database.
  //
  // If the yields are the same as the previous ones, we only insert them when
  // nearing the end of the day (9 PM UTC). This avoids not inserting any
  // yields for a full day.
  delete lastYields.date
  const yieldsAreDifferent = JSON.stringify(lastYields) != JSON.stringify(yields)
  const nearingEndOfDay = new Date().getUTCHours() > 21

  if (yieldsAreDifferent || nearingEndOfDay) {
    yields.date = today
    await redis.rpush('yields', JSON.stringify(yields))
    res.status(200).json({
      status: 'success',
      yields: JSON.stringify(yields)
    })
  }
  else {
    res.status(200).json({
      status: 'yields same as yesterday',
      yields: JSON.stringify(yields),
      today: today,
      hours: new Date().getUTCHours()
    })
  }
}
