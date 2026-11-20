import type { NextApiRequest, NextApiResponse } from 'next'

import { pgSql } from '@/lib/db'
import { fetchAppFeed } from '@/lib/swissborg'

export default async function storePlatformStats(req: NextApiRequest, res: NextApiResponse) {
   if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Only POST requests allowed' })
   }
   if (!pgSql) {
      return res.status(503).json({ message: 'Database not configured' })
   }

   const feed = await fetchAppFeed()
   const today = new Date().toISOString().substring(0, 10)

   await pgSql`
      insert into platform_stats (date, feed) values (${today}, ${pgSql.json(feed)})
      on conflict (date) do update set feed = excluded.feed`

   res.status(200).json({ status: 'success' })
}
