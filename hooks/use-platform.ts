import useSWR from 'swr'

import type { PlatformResponse } from '@/types/api'

export function usePlatform() {
   return useSWR<PlatformResponse>('/api/platform')
}
