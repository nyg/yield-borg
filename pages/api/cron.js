import Redis from 'ioredis'
import puppeteer from 'puppeteer'


export default async (req, res) => {

  const redis = new Redis(process.env.REDIS_URL)

  /* Check date of the last insert into the db. */
  const today = new Date().toLocaleDateString('en-GB')
  const lastUpdate = await redis.get('lastUpdate')

  if (lastUpdate == today) {
    res.status(200).json({ status: "error, yields already updated" })
    return
  }

  /* Get yields */
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // wait until page is fully loaded
  await page.goto('https://swissborg.com/smart-yield-account', { waitUntil: 'networkidle2', timeout: 10000 });

  // iterate on all div.fPUoQh, each contains both the asset name and yield percentage
  const yields = await page.$$eval('div.fPUoQh', (divs, today) =>

    // reduce the array of divs to return an object with the asset names a keys and yield percentages as values
    divs.reduce((yields, div) => {

      const asset = div.querySelector('h3.dIBorz').textContent
      const percentage = parseFloat(div.querySelector('p.gXTxfN').textContent.replace(/Premium (.*?)% p.a./, '$1'))

      if (isFinite(percentage)) {
        yields[asset] = percentage
      }

      return yields
    }, { date: today })

    // needs to be passed to $$eval otherwise Puppeteer fails and throws a ReferenceError
    , today)

  await browser.close()

  /* Insert new yields */
  redis.rpush('yields', JSON.stringify(yields))
  redis.set('lastUpdate', today)

  res.status(200).json({
    status: 'success',
    yields: yields
  })
}