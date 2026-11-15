import { cn } from 'cn'
import { useState } from 'react'

import SeriesKey from '@/components/series-key'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Toggle } from '@/components/ui/toggle'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { Selection } from '@/hooks/use-asset-selection'
import { useYields } from '@/hooks/use-yields'
import type { TimeFrame } from '@/utils/chart-settings'
import * as format from '@/utils/format'
import { seriesStyle } from '@/utils/series-style'
import { multiplierFor, splitAssetName, type YieldRate } from '@/utils/swissborg-config'

type SortOrder = 'apy' | 'name'

type YieldStrategiesProps = {
   timeFrame: TimeFrame
   yieldRate: YieldRate
   selection: Selection
   onToggle: (asset: string) => void
}

export default function YieldStrategies({ timeFrame, yieldRate, selection, onToggle }: YieldStrategiesProps) {

   const { data, error } = useYields(timeFrame)
   const [sortOrder, setSortOrder] = useState<SortOrder>('apy')
   const [expanded, setExpanded] = useState(false)

   const latest = data?.yields.at(-1)
   const strategies = (data?.assets ?? []).map(asset => {
      const value = latest?.[asset]
      return {
         asset,
         ...splitAssetName(asset),
         slot: selection[asset],
         apy: value === undefined ? undefined : Number(value) * multiplierFor[yieldRate],
      }
   })

   const sortedStrategies = sortOrder === 'apy'
      ? strategies.toSorted((a, b) => (b.apy ?? -1) - (a.apy ?? -1))
      : strategies

   return (
      <Card className="lg:h-[34rem]">
         <CardHeader>
            <CardTitle>Strategies</CardTitle>
            <CardDescription>
               {latest ? `Current APY, ${format.asLongDate(latest.date)}` : 'Current APY'}
            </CardDescription>
            <CardAction>
               <ToggleGroup
                  type="single" variant="outline" size="sm" spacing={0} aria-label="Sort strategies"
                  value={sortOrder} onValueChange={next => (next === 'apy' || next === 'name') && setSortOrder(next)}>
                  <ToggleGroupItem value="apy" className="pointer-coarse:h-9">APY</ToggleGroupItem>
                  <ToggleGroupItem value="name" className="pointer-coarse:h-9">A–Z</ToggleGroupItem>
               </ToggleGroup>
            </CardAction>
         </CardHeader>
         <CardContent className="min-h-0 flex-1 overflow-y-auto px-2">
            {error
               ? <p className="px-2 text-sm text-muted-foreground">Failed to load strategies.</p>
               : !data
                  ? <Skeleton className="mx-2 h-40" />
                  : (
                     <>
                        <ul className="flex flex-col gap-0.5">
                           {sortedStrategies.map(({ asset, currency, protocol, slot, apy }) => (
                              <li key={asset} className={cn(slot === undefined && !expanded && 'hidden lg:block')}>
                                 <Toggle
                                    pressed={slot !== undefined} onPressedChange={() => onToggle(asset)}
                                    className="h-auto min-h-9 w-full justify-start gap-2.5 px-2 py-1 text-left font-normal data-[state=on]:bg-muted/60 pointer-coarse:min-h-11">
                                    <SeriesKey style={slot === undefined ? undefined : seriesStyle(slot)} />
                                    <span className="min-w-0 flex-1 truncate">
                                       <span className="font-medium">{currency}</span>
                                       {protocol && <span className="text-muted-foreground"> {protocol}</span>}
                                    </span>
                                    <span className="tabular-nums">{apy === undefined ? '—' : format.asPercentage(apy / 100)}</span>
                                 </Toggle>
                              </li>
                           ))}
                        </ul>
                        <Button
                           variant="ghost" className="mt-1 w-full pointer-coarse:h-11 lg:hidden"
                           aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>
                           {expanded ? 'Show selected only' : `Show all ${strategies.length} strategies`}
                        </Button>
                     </>
                  )}
         </CardContent>
      </Card>
   )
}
