import got from 'got'
import type { NextApiRequest, NextApiResponse } from 'next'

const extractIPAddress = (req: NextApiRequest) => {
   const realIP = req.headers['x-real-ip']
   if (realIP) {
      return realIP
   }

   const forwardedFor = req.headers['x-forwarded-for']
   return typeof forwardedFor === 'string'
      ? forwardedFor.split(',')[0]?.trim() || undefined
      : undefined
}

export default async function getGoatCounter(req: NextApiRequest, res: NextApiResponse) {

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
            bot: parseInt(String(req.query.b)),
            user_agent: req.headers['user-agent'],
            ip: extractIPAddress(req),
         }],
      },
      responseType: 'json',
      headers: {
         'Content-type': 'application/json',
         'Authorization': `Bearer ${process.env.GOAT_KEY}`,
      },
   })

   res.status(200).end()
}
