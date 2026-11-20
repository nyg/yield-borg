import type { NextApiRequest, NextApiResponse } from 'next'

import { pgSql } from '@/lib/db'
import { type AppFeed, fetchBurns, fetchBuybacks, fetchUserGrowth } from '@/lib/swissborg'
import type { PlatformResponse, PlatformStats } from '@/types/api'

type StatsRow = { date: Date, feed: AppFeed }

const day = 24 * 60 * 60 * 1000

const calendarDay = (timestamp: number) => timestamp - timestamp % day

const byDate = (a: { date: number }, b: { date: number }) => a.date - b.date

function numberField(feed: AppFeed, field: string) {
   const value = feed[field]
   return typeof value === 'number' ? value : null
}

async function readStats(): Promise<PlatformStats[]> {
   if (!pgSql) {
      return []
   }

   const rows = await pgSql<StatsRow[]>`select date, feed from platform_stats order by date`
   return rows.map(({ date, feed }) => ({
      date: date.getTime(),
      aumUsd: numberField(feed, 'totalAumUSD'),
      yieldEarnedUsd: numberField(feed, 'totalYieldEarnedUSD'),
      weeklyVolumeUsd: numberField(feed, 'weeklyVolumeUSD'),
      verifiedUsers: numberField(feed, 'verifiedUsersCount'),
      borgHolders: numberField(feed, 'numberBorgHoldersLastWeek'),
      borgLockedPercentage: numberField(feed, 'BORGStakedGovernancePct'),
   }))
}

export default async function getPlatform(_req: NextApiRequest, res: NextApiResponse<PlatformResponse>) {
   const [stats, userGrowth, buybacks, burns] = await Promise.all([
      readStats(), fetchUserGrowth(), fetchBuybacks(), fetchBurns(),
   ])

   res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
   res.status(200).json({
      stats,
      verifiedUsers: userGrowth
         .map(item => ({ date: Date.parse(item.date), value: item.verifiedUsersCount }))
         .toSorted(byDate),
      buybacks: buybacks
         .map(item => ({
            date: Date.parse(item.buybacksStartDate.replace(/^(\d{2})\.(\d{2})\.(\d{4})$/, '$3-$2-$1')),
            value: item.buybacksUSD,
         }))
         .toSorted(byDate),
      burns: burns
         .map(burn => ({
            date: calendarDay(Date.parse(burn.dateTime.replace(' ', 'T'))),
            value: burn.amount,
            url: burn.url,
         }))
         .toSorted(byDate),
   })
}
