import { usePlatform } from '@/hooks/use-platform'
import * as format from '@/utils/format'

import PlatformChart from './platform-chart'

export default function BorgBuybacksChart() {

   const { data, error } = usePlatform()

   const points = data?.buybacks
   const first = points?.at(0)
   const latest = points?.at(-1)
   const total = points?.reduce((sum, point) => sum + point.value, 0) ?? 0

   return (
      <PlatformChart
         title="BORG buybacks" kind="bar" points={points} failed={Boolean(error)}
         value={latest && format.asUsd(latest.value)}
         detail={latest && first && `Week of ${format.asLongDate(latest.date)}, ${format.asCompactUsd(total)} since ${format.asLongDate(first.date)}`}
         valueLabel="Bought back" formatValue={format.asUsd} formatTick={format.asCompactUsd} />
   )
}
