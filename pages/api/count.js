import got from 'got'

function parseIP(req) {
  try {
    // try to get the client's ip address
    return req.headers['x-real-ip']
      || (typeof req.headers['x-forwarded-for'] === 'string'
        && req.headers['x-forwarded-for'].split(',').shift().trim())
      || undefined
  }
  catch (err) {
    return undefined
  }
}

export default async (req, res) => {

  console.log(parseIP(req))

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
        ip: parseIP(req)
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
