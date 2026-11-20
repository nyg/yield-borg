import { Line, LineChart, ReferenceDot, XAxis, YAxis } from 'recharts'

import { Card, CardContent } from '@/components/ui/card'
import { ChartContainer } from '@/components/ui/chart'
import type { DatedValue } from '@/types/api'

type StatTileProps = {
   label: string
   value: string
   detail: string
   trend: DatedValue[]
}

export default function StatTile({ label, value, detail, trend }: StatTileProps) {
   const last = trend.at(-1)

   return (
      <Card size="sm">
         <CardContent className="grid gap-0.5">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-semibold tracking-tight">{value}</p>
            <p className="text-xs text-muted-foreground">{detail}</p>
            {trend.length > 1 && last && (
               <ChartContainer config={{}} aria-hidden="true" className="mt-2 aspect-auto h-8 w-full">
                  <LineChart data={trend} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
                     <XAxis dataKey="date" type="number" domain={['dataMin', 'dataMax']} hide />
                     <YAxis domain={['dataMin', 'dataMax']} hide />
                     <Line
                        dataKey="value" type="monotone" stroke="var(--muted-foreground)" strokeWidth={2}
                        dot={false} isAnimationActive={false} />
                     <ReferenceDot
                        x={last.date} y={last.value} r={4}
                        fill="var(--primary)" stroke="var(--card)" strokeWidth={2} />
                  </LineChart>
               </ChartContainer>
            )}
         </CardContent>
      </Card>
   )
}
