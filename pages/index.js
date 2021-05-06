import useSWR from 'swr'
import { useCookies } from 'react-cookie'
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import Layout from '../components/layout'
import YieldTooltip from '../components/yield-tooltip'
import assetsInfo from '../utils/assets'
import * as format from '../utils/format'

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function SmartYields() {

  const [cookies, setCookie] = useCookies()

  const changeLineType = event => {
    setCookie('lineType', event.target.value)
  }

  const { data, error } = useSWR('/api/yields', fetcher)
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
        <LineChart data={data.yields} margin={{ top: 25, right: 60, bottom: 20, left: 0 }}>
          {data.assets.map(asset => (
            <Line key={asset} dataKey={asset} type={cookies.lineType} stroke={assetsInfo[asset].color} strokeWidth={2} dot={false} unit="%" />
          ))}
          <CartesianGrid stroke="#ddd" strokeDasharray="3 3" />
          <XAxis tickMargin={10} dataKey="date" scale="time" type="number" ticks={data.xTicks} domain={['auto', 'auto']} tickFormatter={(timestamp) => format.asShortDate(timestamp)} />
          <YAxis tickMargin={10} unit="%" />
          <Tooltip content={<YieldTooltip />} />
          <Legend iconType="plainline" align="center" wrapperStyle={{ paddingLeft: "52px", paddingTop: "18px" }} />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return (
    <Layout name="Smart Yields">
      <div className="pl-16 mt-4 space-x-3">
        <label htmlFor="line-type">Line type</label>
        <select id="line-type" value={cookies.lineType} onChange={changeLineType}>
          <option value="monotone">Monotone</option>
          <option value="linear">Linear</option>
          <option value="step">Step</option>
          <option value="stepAfter">Step After</option>
        </select>
      </div>
      {graph}
      <div className="pl-16 pt-4">
        <ul className="list-disc">
          <li><a href="https://swissborg.com/blog/smart-yield-report-march-2021">Smart Yield Report, March 2021</a></li>
          <li><a href="https://swissborg.com/blog/smart-yield-report-february-2021">Smart Yield Report, February 2021</a></li>
          <li><a href="https://swissborg.com/blog/smart-yield-report-december-2020-january-2021">Smart Yield Report, December 2020 & January 2021</a></li>
        </ul>
      </div>
    </Layout>
  )
}
