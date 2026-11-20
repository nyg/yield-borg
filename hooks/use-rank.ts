import useSWR from 'swr'

import { usePreference } from '@/hooks/use-preference'
import type { RanksResponse } from '@/types/api'

export function useRank() {
   const { data, error } = useSWR<RanksResponse>('/api/ranks')
   const ranks = data?.ranks ?? []
   const [value, setValue] = usePreference('yieldRate', ranks, ranks[0]?.value ?? '')

   return {
      ranks,
      rank: ranks.find(rank => rank.value === value),
      setRank: setValue,
      error: error as unknown,
   }
}
