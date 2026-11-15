import { useState } from 'react'
import useSWR from 'swr'

import SeriesKey from '@/components/series-key'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Selection } from '@/hooks/use-asset-selection'
import type { YieldAverageResponse } from '@/types/api'
import * as format from '@/utils/format'
import { seriesStyle } from '@/utils/series-style'
import { multiplierFor, splitAssetName, type YieldRate, yieldRates } from '@/utils/swissborg-config'

const collapsedMonthCount = 12
const stickyColumn = 'sticky left-0 bg-card pl-4'

const isSameMonth = (a: number, b: number) =>
   new Date(a).toISOString().substring(0, 7) === new Date(b).toISOString().substring(0, 7)

type YieldAveragesProps = {
   yieldRate: YieldRate
   selection: Selection
}

export default function YieldAverages({ yieldRate, selection }: YieldAveragesProps) {

   const { data, error } = useSWR<YieldAverageResponse>('/api/yield-average')
   const [showAll, setShowAll] = useState(false)
   const [now] = useState(() => Date.now())

   const assets = data?.assets.filter(asset => asset in selection) ?? []
   const months = data?.yieldAverages ?? []
   const visibleMonths = showAll ? months : months.slice(0, collapsedMonthCount)
   const rateLabel = yieldRates.find(rate => rate.value === yieldRate)?.label

   const message = error ? 'Failed to load yield averages.'
      : data && assets.length === 0 ? 'Select a strategy to see its monthly averages.'
         : null

   return (
      <Card>
         <CardHeader>
            <CardTitle>Monthly averages</CardTitle>
            <CardDescription>Average APY per month, {rateLabel} rate</CardDescription>
         </CardHeader>
         <CardContent className="px-0">
            {message
               ? <p className="px-4 text-sm text-muted-foreground">{message}</p>
               : !data
                  ? <Skeleton className="mx-4 h-40" />
                  : (
                     <>
                        <Table>
                           <TableHeader>
                              <TableRow className="hover:bg-transparent">
                                 <TableHead className={stickyColumn}>Month</TableHead>
                                 {assets.map(asset => {
                                    const { currency, protocol } = splitAssetName(asset)
                                    return (
                                       <TableHead key={asset} className="py-2 text-right last:pr-4">
                                          <div className="flex items-center justify-end gap-1.5">
                                             <SeriesKey style={seriesStyle(selection[asset] ?? 0)} />
                                             {currency}
                                          </div>
                                          <div className="text-xs font-normal text-muted-foreground">{protocol}</div>
                                       </TableHead>
                                    )
                                 })}
                              </TableRow>
                           </TableHeader>
                           <TableBody>
                              {visibleMonths.map(average => (
                                 <TableRow key={average.date} className="hover:bg-transparent">
                                    <TableHead scope="row" className={`${stickyColumn} font-normal`}>
                                       <span className="sm:hidden">{format.asShortMonthYearDate(average.date)}</span>
                                       <span className="hidden sm:inline">{format.asMonthYearDate(average.date)}</span>
                                       {isSameMonth(average.date, now) && <span className="text-muted-foreground"> to date</span>}
                                    </TableHead>
                                    {assets.map(asset => {
                                       const value = average[asset]
                                       return (
                                          <TableCell key={asset} className="text-right tabular-nums last:pr-4">
                                             {value === undefined
                                                ? <span className="text-muted-foreground">—</span>
                                                : format.asPercentage(Number(value) * multiplierFor[yieldRate])}
                                          </TableCell>
                                       )
                                    })}
                                 </TableRow>
                              ))}
                           </TableBody>
                        </Table>
                        {months.length > collapsedMonthCount && (
                           <div className="px-2 pt-2">
                              <Button
                                 variant="ghost" className="w-full pointer-coarse:h-11"
                                 aria-expanded={showAll} onClick={() => setShowAll(!showAll)}>
                                 {showAll ? `Show last ${collapsedMonthCount} months` : `Show all ${months.length} months`}
                              </Button>
                           </div>
                        )}
                     </>
                  )}
         </CardContent>
      </Card>
   )
}
