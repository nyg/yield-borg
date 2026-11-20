import { ExternalLink } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { usePlatform } from '@/hooks/use-platform'
import * as format from '@/utils/format'

export default function BorgBurnsTable() {

   const { data, error } = usePlatform()
   const burns = data?.burns.toReversed()

   return (
      <Card className="lg:h-[29.5rem]">
         <CardHeader>
            <CardTitle id="borg-burns-title">Burns</CardTitle>
            <CardDescription>Each burn and its transaction</CardDescription>
         </CardHeader>
         <CardContent
            tabIndex={0} role="region" aria-labelledby="borg-burns-title"
            className="max-h-96 min-h-0 flex-1 overflow-y-auto px-0 lg:max-h-none">
            {error
               ? <p className="px-4 text-sm text-muted-foreground">Failed to load the burns.</p>
               : !burns
                  ? <Skeleton className="mx-4 h-40" />
                  : (
                     <Table>
                        <TableHeader>
                           <TableRow className="hover:bg-transparent">
                              <TableHead className="pl-4">Date</TableHead>
                              <TableHead className="text-right">BORG</TableHead>
                              <TableHead className="pr-4 text-right">Transaction</TableHead>
                           </TableRow>
                        </TableHeader>
                        <TableBody>
                           {burns.map(burn => (
                              <TableRow key={burn.url} className="hover:bg-transparent">
                                 <TableHead scope="row" className="pl-4 font-normal">{format.asLongDate(burn.date)}</TableHead>
                                 <TableCell className="text-right tabular-nums">{format.asInteger(burn.value)}</TableCell>
                                 <TableCell className="pr-4 text-right">
                                    <a
                                       href={burn.url} target="_blank" rel="noreferrer"
                                       className="inline-flex items-center gap-1 py-1 underline-offset-4 hover:underline">
                                       Etherscan
                                       <ExternalLink aria-hidden="true" className="size-3" />
                                       <span className="sr-only">, burn of {format.asLongDate(burn.date)}</span>
                                    </a>
                                 </TableCell>
                              </TableRow>
                           ))}
                        </TableBody>
                     </Table>
                  )}
         </CardContent>
      </Card>
   )
}
