import { useMemo, useState } from 'react'

import { usePlatform } from '@/hooks/use-platform'
import type { BorgBurn, DatedValue } from '@/types/api'
import * as format from '@/utils/format'

import PlatformChart from './platform-chart'

const day = 24 * 60 * 60 * 1000

function runningTotal(burns: BorgBurn[], today: number) {
   let total = 0
   const points: DatedValue[] = burns.map(burn => {
      total += burn.value
      return { date: burn.date, value: total }
   })
   const last = points.at(-1)
   return last && last.date < today ? [...points, { date: today, value: total }] : points
}

export default function BorgBurnsChart() {

   const { data, error } = usePlatform()
   const [today] = useState(() => Date.now() - Date.now() % day)

   const burns = data?.burns
   const points = useMemo(() => burns && runningTotal(burns, today), [burns, today])
   const latestBurn = burns?.at(-1)
   const total = points?.at(-1)?.value

   return (
      <PlatformChart
         title="BORG burned" kind="step" points={points} failed={Boolean(error)}
         value={total === undefined ? undefined : `${format.asCompactNumber(total)} BORG`}
         detail={latestBurn && `Latest burn of ${format.asCompactNumber(latestBurn.value)} BORG on ${format.asLongDate(latestBurn.date)}`}
         valueLabel="Burned to date" formatValue={value => `${format.asInteger(value)} BORG`} formatTick={format.asCompactNumber} />
   )
}
