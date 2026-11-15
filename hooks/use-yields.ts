import useSWR from 'swr'

import { useHydrated } from '@/hooks/use-preference'
import type { YieldResponse } from '@/types/api'
import type { TimeFrame } from '@/utils/chart-settings'

export function useYields(timeFrame: TimeFrame) {
   const hydrated = useHydrated()
   return useSWR<YieldResponse>(
      hydrated ? `/api/yield?timeFrame=${timeFrame}` : null,
      { keepPreviousData: true }
   )
}
