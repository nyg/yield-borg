import { useCookies } from 'react-cookie'
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import YieldTooltip from '../components/yield-tooltip'
import assetsInfo from '../utils/assets'
import * as format from '../utils/format'

const multiplierFor = { genesis: 1, community: .75, standard: .5 }

export default function YieldChart({ data }) {

  const [cookies, _] = useCookies()

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

  return (
    <ResponsiveContainer width="100%" aspect={1.618}>
      <LineChart data={yields} margin={{ top: 0, right: 63.5, bottom: 0, left: 3.5 }}>
        {data.assets.map(asset => (
          <Line key={asset} dataKey={asset} type={cookies.lineType} stroke={assetsInfo[asset].color} strokeWidth={1.5} dot={false} unit="%" />
        ))}
        <CartesianGrid stroke="#ddd" strokeDasharray="3 3" />
        <XAxis tickMargin={10} dataKey="date" scale="time" type="number" ticks={data.xTicks} domain={['auto', 'auto']} tickFormatter={format.asShortDate} />
        <YAxis tickMargin={10} unit="%" />
        <Tooltip content={<YieldTooltip />} />
        <Legend iconType="plainline" align="center" wrapperStyle={{ paddingLeft: '61px', paddingTop: '6px' }} />
      </LineChart>
    </ResponsiveContainer>
  )
}