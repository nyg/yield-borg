import { useCallback, useMemo } from 'react'

import { useStoredValue } from '@/hooks/use-preference'
import { defaultSelectedAssets } from '@/utils/swissborg-config'

export type Selection = Record<string, number>

const defaultSelection: Selection = Object.fromEntries(
   defaultSelectedAssets.map((asset, slot) => [asset, slot])
)

const isSelection = (value: unknown): value is Selection =>
   typeof value === 'object' && value !== null && !Array.isArray(value)
   && Object.values(value).every(slot => Number.isInteger(slot) && slot >= 0)

function parseSelection(stored: string | null) {
   try {
      const parsed: unknown = stored === null ? null : JSON.parse(stored)
      return isSelection(parsed) ? parsed : defaultSelection
   } catch {
      return defaultSelection
   }
}

function lowestFreeSlot(selection: Selection) {
   const usedSlots = new Set(Object.values(selection))
   let slot = 0
   while (usedSlots.has(slot)) {
      slot++
   }
   return slot
}

export function useAssetSelection() {
   const [stored, setStored] = useStoredValue('selection')
   const selection = useMemo(() => parseSelection(stored), [stored])

   const toggle = useCallback((asset: string) => {
      const { [asset]: slot, ...others } = selection
      const next = slot === undefined
         ? { ...selection, [asset]: lowestFreeSlot(selection) }
         : others
      setStored(JSON.stringify(next))
   }, [selection, setStored])

   return { selection, toggle }
}
