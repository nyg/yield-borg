import { cn } from 'cn'
import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, type TooltipContentProps, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import type { DatedValue } from '@/types/api'
import * as format from '@/utils/format'
import { timeAxis } from '@/utils/time-axis'

const chartSize = 'h-64 w-full sm:h-72'
const margin = { top: 8, right: 8, bottom: 0, left: 0 }

type ValueFormatter = (value: number) => string

type PlatformChartTooltipProps = Pick<TooltipContentProps, 'active' | 'payload' | 'label'> & {
   valueLabel: string
   formatValue: ValueFormatter
}

function PlatformChartTooltip({ active, payload, label, valueLabel, formatValue }: PlatformChartTooltipProps) {
   const value = payload?.[0]?.value
   if (!active || value === undefined) {
      return null
   }

   return (
      <div className="rounded-lg border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md">
         <div className="mb-1 font-medium">{format.asLongDate(Number(label))}</div>
         <div className="flex gap-3">
            <span className="grow text-muted-foreground">{valueLabel}</span>
            <span className="font-medium tabular-nums">{formatValue(Number(value))}</span>
         </div>
      </div>
   )
}

type PlatformChartProps = {
   title: string
   value: string | undefined
   detail: string | undefined
   points: DatedValue[] | undefined
   failed: boolean
   kind: 'line' | 'step' | 'bar'
   valueLabel: string
   formatValue: ValueFormatter
   formatTick: ValueFormatter
}

export default function PlatformChart({
   title, value, detail, points, failed, kind, valueLabel, formatValue, formatTick,
}: PlatformChartProps) {

   const { ticks, tickFormatter } = useMemo(() => timeAxis(points?.map(point => point.date) ?? []), [points])

   const message = failed ? `Failed to load ${title.toLowerCase()}.`
      : points?.length === 0 ? 'No data yet.'
         : null

   const tooltip = (
      <ChartTooltip
         isAnimationActive={false}
         content={({ active, payload, label }) => (
            <PlatformChartTooltip
               active={active} payload={payload} label={label}
               valueLabel={valueLabel} formatValue={formatValue} />
         )} />
   )

   return (
      <Card>
         <CardHeader>
            <CardTitle>{title}</CardTitle>
            {value && <p className="text-3xl font-semibold tracking-tight">{value}</p>}
            {detail && <CardDescription>{detail}</CardDescription>}
         </CardHeader>
         <CardContent>
            {message
               ? <div className={cn(chartSize, 'flex items-center justify-center text-sm text-muted-foreground')}>{message}</div>
               : !points
                  ? <Skeleton className={chartSize} />
                  : (
                     <ChartContainer config={{}} className={cn(chartSize, 'aspect-auto')}>
                        {kind === 'bar'
                           ? (
                              <BarChart data={points} accessibilityLayer margin={margin} barCategoryGap={2}>
                                 <CartesianGrid vertical={false} />
                                 <XAxis
                                    dataKey="date" tickFormatter={tickFormatter} minTickGap={24}
                                    tickLine={false} axisLine={false} tickMargin={8} />
                                 <YAxis
                                    width="auto" tickFormatter={formatTick}
                                    tickLine={false} axisLine={false} tickMargin={4} />
                                 {tooltip}
                                 <Bar
                                    dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={24}
                                    isAnimationActive={false} />
                              </BarChart>
                           )
                           : (
                              <LineChart data={points} accessibilityLayer margin={margin}>
                                 <CartesianGrid vertical={false} />
                                 <XAxis
                                    dataKey="date" type="number" scale="time" domain={['dataMin', 'dataMax']}
                                    ticks={ticks} tickFormatter={tickFormatter} interval="equidistantPreserveStart"
                                    tickLine={false} axisLine={false} tickMargin={8} />
                                 <YAxis
                                    width="auto" domain={['auto', 'auto']} tickFormatter={formatTick}
                                    tickLine={false} axisLine={false} tickMargin={4} />
                                 {tooltip}
                                 <Line
                                    dataKey="value" type={kind === 'step' ? 'stepAfter' : 'monotone'}
                                    stroke="var(--primary)" strokeWidth={2} dot={false}
                                    activeDot={{ r: 4, stroke: 'var(--card)', strokeWidth: 2 }}
                                    isAnimationActive={false} />
                              </LineChart>
                           )}
                     </ChartContainer>
                  )}
         </CardContent>
      </Card>
   )
}
