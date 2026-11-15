import type { NextApiRequest, NextApiResponse } from 'next'

import { pgSql } from '@/lib/db'
import type { CommunityIndexResponse } from '@/types/api'

type CommunityIndexRow = { date: Date, value: string }

export default async function getCommunityIndex(_req: NextApiRequest, res: NextApiResponse<CommunityIndexResponse>) {
   if (!pgSql) {
      return res.status(200).json({ communityIndices: [] })
   }

   const rows = await pgSql<CommunityIndexRow[]>`select * from community_indices order by date`

   res.status(200).json({
      communityIndices: rows.map(row => ({
         date: row.date.getTime(),
         value: row.value,
      })),
   })
}
