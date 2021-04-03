import got from 'got'

export default async (req, res) => {

  await got.post('https://yield-borg.goatcounter.com/api/v0/count', {
    json: {
      no_sessions: true,
      hits: [{
        path: req.query.p,
        title: req.query.t,
        event: req.query.e,
        ref: req.query.r,
        size: req.query.s,
        query: req.query.q,
        bot: parseInt(req.query.b),
        user_agent: req.headers['user-agent'],
        ip: req.client.localAddress
      }]
    },
    responseType: 'json',
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${process.env.GOAT_KEY}`
    }
  })

  res.status(200).end()
}
