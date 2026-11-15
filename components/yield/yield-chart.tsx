import { cn } from 'cn'
import { useMemo } from 'react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'

import { Card, CardContent } from '@/components/ui/card'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import type { Selection } from '@/hooks/use-asset-selection'
import { useYields } from '@/hooks/use-yields'
import type { YieldResponse } from '@/types/api'
import type { LineType, TimeFrame } from '@/utils/chart-settings'
import { seriesStyle } from '@/utils/series-style'
import { multiplierFor, type YieldRate } from '@/utils/swissborg-config'
import { timeAxis } from '@/utils/time-axis'

import YieldChartTooltip from './yield-chart-tooltip'

type ChartRow = { date: number, [asset: string]: number }

const chartSize = 'h-72 w-full sm:h-96 lg:h-full'

function toChartRows(data: YieldResponse, assets: string[], multiplier: number) {
   return data.yields.map(point => {
      const row: ChartRow = { date: point.date }
      for (const asset of assets) {
         const value = point[asset]
         if (value !== undefined) {
            row[asset] = Number(value) * multiplier
         }
      }
      return row
   })
}

type YieldChartProps = {
   timeFrame: TimeFrame
   lineType: LineType
   yieldRate: YieldRate
   selection: Selection
}

export default function YieldChart({ timeFrame, lineType, yieldRate, selection }: YieldChartProps) {

   const { data, error, isLoading } = useYields(timeFrame)

   const assets = useMemo(
      () => data?.assets.filter(asset => asset in selection) ?? [],
      [data, selection]
   )
   const rows = useMemo(
      () => data ? toChartRows(data, assets, multiplierFor[yieldRate]) : [],
      [data, assets, yieldRate]
   )
   const { ticks, tickFormatter } = useMemo(() => timeAxis(rows.map(row => row.date)), [rows])

   const message = error ? 'Failed to load yields.'
      : data && rows.length === 0 ? 'No yields for this time frame.'
         : data && assets.length === 0 ? 'Select a strategy to plot its yield.'
            : null

   return (
      <Card className="lg:h-[34rem]">
         <CardContent className="min-h-0 flex-1">
            {message
               ? <div className={cn(chartSize, 'flex items-center justify-center text-sm text-muted-foreground')}>{message}</div>
               : !data
                  ? <Skeleton className={chartSize} />
                  : (
                     <ChartContainer config={{}} className={cn(chartSize, 'aspect-auto transition-opacity', isLoading && 'opacity-50')}>
                        <LineChart data={rows} accessibilityLayer margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                           <CartesianGrid vertical={false} />
                           <XAxis
                              dataKey="date" type="number" scale="time" domain={['dataMin', 'dataMax']}
                              ticks={ticks} tickFormatter={tickFormatter} interval="equidistantPreserveStart"
                              tickLine={false} axisLine={false} tickMargin={8} />
                           <YAxis
                              width="auto" tickFormatter={value => `${value}%`}
                              tickLine={false} axisLine={false} tickMargin={4} />
                           <ChartTooltip
                              isAnimationActive={false}
                              content={({ active, payload, label }) => (
                                 <YieldChartTooltip active={active} payload={payload} label={label} selection={selection} />
                              )} />
                           {assets.map(asset => {
                              const { color, dash } = seriesStyle(selection[asset] ?? 0)
                              return (
                                 <Line
                                    key={asset} name={asset} dataKey={(row: ChartRow) => row[asset]}
                                    type={lineType} stroke={color} strokeWidth={2} strokeDasharray={dash}
                                    dot={false} activeDot={{ r: 4, stroke: 'var(--card)', strokeWidth: 2 }}
                                    isAnimationActive={false} />
                              )
                           })}
                        </LineChart>
                     </ChartContainer>
                  )}
         </CardContent>
      </Card>
   )
}
