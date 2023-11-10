import useSWR from 'swr'
import { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import YieldChartTooltip from './yield-chart-tooltip'
import { colorFor, multiplierFor } from '../../utils/config'
import * as format from '../../utils/format'

const maxAge = { maxAge: 315360000 }


export default function YieldChart() {

  const [cookies, setCookie] = useCookies()

  // if no cookies are set, set some default values
  useEffect(() => {
    Object.keys(cookies).length == 0 && [
      'ETH (Ethereum Blockchain)',
      'USDC (Stargate)',
      'SOL (Jito Network&Solana Blockchain)',
      'ATOM (Cosmos Blockchain Kiln)',
      'MATIC (Polygon Blockchain)'
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
  const toggle = line => setCookie(line.dataKey, line.inactive, maxAge)

  return (
    <div className="mx-auto xl:w-2/3">
      <ResponsiveContainer aspect={1.8}>
        <LineChart data={yields} margin={{ top: 0, right: 63.5, bottom: 0, left: 3.5 }}>
          <CartesianGrid stroke="#ddd" strokeDasharray="3 3" />
          <XAxis tickMargin={10} dataKey="date" scale="time" type="number" ticks={data.xTicks} domain={['auto', 'auto']} tickFormatter={format.asShortDate} />
          <YAxis tickMargin={10} unit="%" />

          {data.assets.map(asset =>
            <Line
              key={asset} dataKey={asset}
              type={cookies.lineType} hide={cookies[asset] !== true}
              stroke={colorFor(asset)} strokeWidth={1.5}
              dot={cookies.lineType.includes('step') ? false : { r: 1, fill: colorFor(asset) }} />)}

          <Tooltip content={<YieldChartTooltip />} offset={50} />
          <Legend iconType="plainline" verticalAlign="top" onClick={toggle} wrapperStyle={{ padding: '0 0 10px 61px' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
