import got from 'got'
import type { NextApiRequest, NextApiResponse } from 'next'

import { pgSql } from '@/lib/db'

type AppFeedResponse = {
   data: { sbAppFeed: { communityIndex: number } }
}

export default async function fetchAndStoreCommunityIndex(req: NextApiRequest, res: NextApiResponse) {
   if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Only POST requests allowed' })
   }
   if (!pgSql) {
      return res.status(503).json({ message: 'Database not configured' })
   }

   const appFeed = await got('https://swissborg.com/page-data/sq/d/3043756154.json').json<AppFeedResponse>()
   const communityIndex = appFeed.data.sbAppFeed.communityIndex

   // this script runs every Wednesday
   const tuesday = new Date()
   tuesday.setDate(tuesday.getDate() - 1)

   await pgSql`INSERT INTO community_indices (date, value) VALUES(${tuesday}, ${communityIndex})`

   res.status(200).json({ status: 'success' })
}
