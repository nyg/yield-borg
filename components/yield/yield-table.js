import useSWR from 'swr'
import { useCookies } from 'react-cookie'
import { multiplierFor } from '../../utils/config'
import { assetsOf } from '../../utils/utils'
import * as format from '../../utils/format'


export default function YieldTable({ className }) {

   const [cookies] = useCookies()

   // retrieve yield averages
   const { data, error } = useSWR('/api/yield-average')
   if (error) {
      return <div className="text-center pt-4">Failed to load yield averages!</div>
   }
   else if (!data) {
      return <div className="text-center pt-4">Loading yield averages…</div>
   }

   // adapt yield averages to the wanted yield rate (genesis, community or standard)
   const yieldAverages = data.yieldAverages.map(average =>
      assetsOf(average).reduce((newAverage, asset) => {
         newAverage[asset] = average[asset] * multiplierFor[cookies.yieldRate]
         return newAverage
      }, { date: average.date })
   )

   return (
      <div className={className}>
         <table className="w-full text-right">
            <thead>
               <tr className="border-b border-gray-400">
                  <th></th>
                  {data.assets.map(asset => (
                     <th key={asset} className="pb-1">{asset}</th>
                  ))}
               </tr>
            </thead>
            <tbody>
               {yieldAverages.map(average => (
                  <tr key={average.date} className="border-b border-gray-200 first:italic">
                     <td className="pb-1 pt-1">{format.asMonthYearDate(average.date)}</td>
                     {data.assets.map(asset =>
                        <td key={asset} className="tabular-nums text-xs align-middle">
                           {average[asset]
                              ? format.asPercentage(average[asset])
                              : ''}
                        </td>
                     )}
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   )
}
