import useSWR from 'swr'
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import Layout from '../components/layout'

const fetcher = (...args) => fetch(...args).then(res => res.json())

const assetsInfo = {
  USDC: { // https://www.centre.io/usdc-brand
    color: '#2775CA'
  },
  CHSB: {
    color: '#01c38d'
  },
  ETH: { // https://ethereum.org/en/assets/
    color: '#575d84'
  }
}

const formatter = new Intl.DateTimeFormat('en-GB', { month: 'numeric', day: 'numeric' })
const longDateFormatter = new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })

export default function SmartYields() {

  const { data, error } = useSWR('/api/yields', fetcher)

  const CustomTooltip = ({ active, payload, label }) => {
    return (
      <div className="grid grid-cols-2 bg-gray-100 bg-opacity-90 border-2 border-gray-500 rounded-md p-3 text-sm">
        <div className="col-span-2 text-center border-b-2 border-gray-400 mb-2">{longDateFormatter.format(label)}</div>
        {payload.sort((a, b) => b.value - a.value).map(y => <>
          <div key={y.dataKey} className="pr-3 ">{y.dataKey}</div>
          <div key={y.dataKey + 'val'} className="text-right tabular-nums">{y.value.toFixed(2)}%</div>
        </>)}
      </div>
    )
  }

  let graph
  if (error) {
    graph = <div className="text-center pt-4">Failed to load data!</div>
  }
  else if (!data) {
    graph = <div className="text-center pt-4">Loading data…</div>
  }
  else {
    graph = (
      <ResponsiveContainer width="100%" aspect={1.618}>
        <LineChart data={data.yields} margin={{ top: 40, right: 60, bottom: 20, left: 0 }}>
          {data.assets.map(asset => (
            <Line key={asset} type="stepAfter" dataKey={asset} stroke={assetsInfo[asset].color} strokeWidth={2} dot={false} unit="%" />
          ))}
          <CartesianGrid stroke="#ddd" strokeDasharray="3 3" />
          <XAxis tickMargin={10} dataKey="date" scale="time" type="number" interval={14} domain={['auto', 'auto']} tickFormatter={(timestamp) => formatter.format(timestamp)} />
          <YAxis tickMargin={10} unit="%" />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="plainline" align="center" wrapperStyle={{ paddingLeft: "52px", paddingTop: "18px" }} />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return (
    <Layout name="Smart Yields">
      {graph}
    </Layout>
  )
}
