import { Skeleton } from '@/components/ui/skeleton'
import { usePlatform } from '@/hooks/use-platform'
import type { PlatformStats } from '@/types/api'
import * as format from '@/utils/format'

import StatTile from './stat-tile'

type Metric = {
   key: Exclude<keyof PlatformStats, 'date'>
   label: string
   detail: string
   format: (value: number) => string
}

const metrics: Metric[] = [
   { key: 'aumUsd', label: 'Assets under management', detail: 'Held by users', format: format.asCompactUsd },
   { key: 'yieldEarnedUsd', label: 'Yield earned', detail: 'By users, all time', format: format.asCompactUsd },
   { key: 'weeklyVolumeUsd', label: 'Trading volume', detail: 'Last 7 days', format: format.asCompactUsd },
   { key: 'verifiedUsers', label: 'Verified users', detail: 'All time', format: format.asCompactNumber },
   { key: 'borgHolders', label: 'BORG holders', detail: 'Last week', format: format.asCompactNumber },
   { key: 'borgLockedPercentage', label: 'BORG locked', detail: 'Of the total supply', format: value => format.asPercentage(value / 100) },
]

const trendLength = 30
const grid = 'grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6'

function trendOf(stats: PlatformStats[], key: Metric['key']) {
   return stats.slice(-trendLength).flatMap(stat => {
      const value = stat[key]
      return value === null ? [] : [{ date: stat.date, value }]
   })
}

export default function PlatformStatTiles() {

   const { data, error } = usePlatform()

   const stats = data?.stats ?? []
   const latest = stats.at(-1)

   if (error) {
      return <p className="text-sm text-muted-foreground">Failed to load the platform figures.</p>
   }
   if (!data) {
      return <div className={grid}>{metrics.map(metric => <Skeleton key={metric.key} className="h-24" />)}</div>
   }
   if (!latest) {
      return <p className="text-sm text-muted-foreground">No daily snapshot yet.</p>
   }

   return (
      <section aria-label="Latest figures" className="space-y-2">
         <div className={grid}>
            {metrics.map(metric => {
               const value = latest[metric.key]
               return (
                  <StatTile
                     key={metric.key} label={metric.label} detail={metric.detail}
                     value={value === null ? '—' : metric.format(value)}
                     trend={trendOf(stats, metric.key)} />
               )
            })}
         </div>
         <p className="text-xs text-muted-foreground">
            {stats.length > 1
               ? `Daily snapshot of ${format.asLongDate(latest.date)}. Trend lines show the last ${trendLength} days.`
               : `Daily snapshot of ${format.asLongDate(latest.date)}. Trend lines appear after the next snapshot.`}
         </p>
      </section>
   )
}
