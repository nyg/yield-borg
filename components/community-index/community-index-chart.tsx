import { Minus, TrendingDown, TrendingUp } from 'lucide-react'
import { useMemo } from 'react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import useSWR from 'swr'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import type { CommunityIndexResponse } from '@/types/api'
import * as format from '@/utils/format'
import { timeAxis } from '@/utils/time-axis'

const chartSize = 'h-72 w-full sm:h-96 lg:h-[28rem]'
const maxScore = 10

const chartConfig = {
   value: { label: 'Score', color: 'var(--primary)' },
} satisfies ChartConfig

function Trend({ change }: { change: number }) {
   const Icon = change > 0 ? TrendingUp : change < 0 ? TrendingDown : Minus
   return (
      <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
         <Icon aria-hidden="true" className="size-4" />
         {change === 0 ? 'Unchanged' : format.asSignedDecimalOne(change)} since the previous week
      </p>
   )
}

export default function CommunityIndexChart() {

   const { data, error } = useSWR<CommunityIndexResponse>('/api/community-index')

   const points = useMemo(
      () => data?.communityIndices.map(({ date, value }) => ({ date, value: Number(value) })) ?? [],
      [data]
   )
   const { ticks, tickFormatter } = useMemo(() => timeAxis(points.map(point => point.date)), [points])

   const latest = points.at(-1)
   const previous = points.at(-2)

   const message = error ? 'Failed to load the community index.'
      : data && !latest ? 'No community index yet.'
         : null

   return (
      <Card>
         {latest && (
            <CardHeader>
               <CardDescription>Latest score, {format.asLongDate(latest.date)}</CardDescription>
               <CardTitle className="text-5xl font-semibold tracking-tight">
                  {format.asDecimalOne(latest.value)}
                  <span className="text-xl font-normal text-muted-foreground"> / {maxScore}</span>
               </CardTitle>
               {previous && <Trend change={latest.value - previous.value} />}
            </CardHeader>
         )}
         <CardContent>
            {message
               ? <div className={`${chartSize} flex items-center justify-center text-sm text-muted-foreground`}>{message}</div>
               : !data
                  ? <Skeleton className={chartSize} />
                  : (
                     <ChartContainer config={chartConfig} className={`${chartSize} aspect-auto`}>
                        <LineChart data={points} accessibilityLayer margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                           <CartesianGrid vertical={false} />
                           <XAxis
                              dataKey="date" type="number" scale="time" domain={['dataMin', 'dataMax']}
                              ticks={ticks} tickFormatter={tickFormatter} interval="equidistantPreserveStart"
                              tickLine={false} axisLine={false} tickMargin={8} />
                           <YAxis
                              width="auto" domain={[0, maxScore]} ticks={[0, 2, 4, 6, 8, 10]}
                              tickLine={false} axisLine={false} tickMargin={4} />
                           <ChartTooltip
                              isAnimationActive={false}
                              content={
                                 <ChartTooltipContent
                                    indicator="line"
                                    labelFormatter={(_, payload) => format.asLongDate(payload[0]?.payload.date)} />
                              } />
                           <Line
                              dataKey="value" type="stepAfter" stroke="var(--color-value)" strokeWidth={2}
                              dot={false} activeDot={{ r: 4, stroke: 'var(--card)', strokeWidth: 2 }}
                              isAnimationActive={false} />
                        </LineChart>
                     </ChartContainer>
                  )}
         </CardContent>
      </Card>
   )
}
