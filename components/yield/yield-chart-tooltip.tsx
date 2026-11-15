import type { TooltipContentProps } from 'recharts'

import SeriesKey from '@/components/series-key'
import type { Selection } from '@/hooks/use-asset-selection'
import * as format from '@/utils/format'
import { seriesStyle } from '@/utils/series-style'

type YieldChartTooltipProps = Pick<TooltipContentProps, 'active' | 'payload' | 'label'> & {
   selection: Selection
}

export default function YieldChartTooltip({ active, payload, label, selection }: YieldChartTooltipProps) {
   if (!active || !payload?.length) {
      return null
   }

   const yields = payload
      .map(({ name, value }) => ({ asset: String(name), apy: Number(value) }))
      .toSorted((a, b) => b.apy - a.apy)

   return (
      <div className="rounded-lg border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md">
         <div className="mb-1.5 font-medium">{format.asLongDate(Number(label))}</div>
         <ul className="grid gap-1">
            {yields.map(({ asset, apy }) => (
               <li key={asset} className="flex items-center gap-2">
                  <SeriesKey style={seriesStyle(selection[asset] ?? 0)} />
                  <span className="grow pr-3 text-muted-foreground">{asset}</span>
                  <span className="font-medium tabular-nums">{format.asPercentage(apy / 100)}</span>
               </li>
            ))}
         </ul>
      </div>
   )
}
