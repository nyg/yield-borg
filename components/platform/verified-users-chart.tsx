import { usePlatform } from '@/hooks/use-platform'
import * as format from '@/utils/format'

import PlatformChart from './platform-chart'

export default function VerifiedUsersChart() {

   const { data, error } = usePlatform()

   const points = data?.verifiedUsers
   const latest = points?.at(-1)
   const previous = points?.at(-2)

   return (
      <PlatformChart
         title="Verified users" kind="line" points={points} failed={Boolean(error)}
         value={latest && format.asInteger(latest.value)}
         detail={latest && previous && `Week of ${format.asLongDate(latest.date)}, ${format.asSignedInteger(latest.value - previous.value)} since the previous week`}
         valueLabel="Verified users" formatValue={format.asInteger} formatTick={format.asCompactNumber} />
   )
}
