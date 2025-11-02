import useSWR from 'swr'
import { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import YieldChartTooltip from './yield-chart-tooltip'
import { colorFor, multiplierFor } from '../../utils/config'
import * as format from '../../utils/format'

const maxAge = { maxAge: 315360000 }
const normalize = assetName => assetName.replace(/[()\s]+/g, '')

export default function YieldChart() {

   const [cookies, setCookie] = useCookies()

   // if no cookies are set, set some default values
   useEffect(() => {
      Object.keys(cookies).length == 0 && [
         normalize('ETH (Ethereum Blockchain)'),
         normalize('USDC (Morpho)'),
         normalize('SOL (Kyros)'),
         normalize('ATOM (Kiln)'),
         normalize('DOT (Kiln)')
      ].map(name => setCookie(name, true, maxAge))
   }, [])

   // retrieve chart data
   const { data, error } = useSWR(`/api/yield?timeFrame=${cookies.timeFrame}`)
   if (error) {
      return <div className="text-center pt-4">Failed to load data!</div>
   }
   else if (!data) {
      return <div className="text-center pt-4">Loading data…</div>
   }

   // adapt yields to the wanted yield rate (genesis, community or standard)
   const yields = data.yields
      .map(_yield =>
         Object
            .keys(_yield)
            .filter(key => key != 'date')
            .reduce((newYield, asset) => {
               newYield[asset] = _yield[asset] * multiplierFor[cookies.yieldRate]
               return newYield
            }, { date: _yield.date })
      )

   // toggle line visibility when clicking on the legend item
   const toggle = line => setCookie(normalize(line.dataKey), line.inactive, maxAge)

   return (
      <div className="mx-auto xl:w-2/3">
         <LineChart data={yields} responsive margin={{ top: 0, right: 63.5, bottom: 0, left: 3.5 }} height={650}>
            <CartesianGrid stroke="#ddd" strokeDasharray="3 3" />
            <XAxis tickMargin={10} dataKey="date" scale="time" type="number" ticks={data.xTicks} domain={['auto', 'auto']} tickFormatter={format.asShortDate} />
            <YAxis tickMargin={10} unit="%" />

            {data.assets.map((asset, index) =>
               <Line
                  key={asset} dataKey={asset}
                  type={cookies.lineType} hide={cookies[normalize(asset)] !== true}
                  stroke={colorFor(index)} strokeWidth={1.5}
                  dot={cookies.lineType.includes('step') ? false : { r: 1, fill: colorFor(index) }} />)}

            <Tooltip content={<YieldChartTooltip />} offset={50} />
            <Legend iconType="plainline" verticalAlign="bottom" onClick={toggle} wrapperStyle={{ padding: '0 0 10px 61px' }} />
         </LineChart>
      </div>
   )
}
