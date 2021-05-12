import { useCookies } from 'react-cookie'
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import YieldTooltip from '../components/yield-tooltip'
import assetsInfo from '../utils/assets'
import * as format from '../utils/format'

const multiplierFor = { genesis: 1, community: .75, standard: .5 }

export default function YieldChart({ data }) {

  const [cookies, setCookie] = useCookies()

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
  const toggle = line => setCookie(line.dataKey, !line.inactive)

  return (
    <ResponsiveContainer width="100%" aspect={1.8}>
      <LineChart data={yields} margin={{ top: 0, right: 63.5, bottom: 0, left: 3.5 }}>
        <CartesianGrid stroke="#ddd" strokeDasharray="3 3" />
        <XAxis tickMargin={10} dataKey="date" scale="time" type="number" ticks={data.xTicks} domain={['auto', 'auto']} tickFormatter={format.asShortDate} />
        <YAxis tickMargin={10} unit="%" />

        {data.assets.map(asset =>
          <Line
            key={asset} dataKey={asset} unit="%"
            type={cookies.lineType} hide={cookies[asset] == 'true'}
            stroke={assetsInfo[asset].color} strokeWidth={1.5}
            dot={cookies.lineType.includes('step') ? false : { r: 1, fill: true }} />)}

        <Tooltip content={<YieldTooltip />} />
        <Legend iconType="plainline" verticalAlign="top" onClick={toggle} wrapperStyle={{ padding: '0 0 10px 61px' }} />
      </LineChart>
    </ResponsiveContainer>
  )
}