import useSWR from 'swr'
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import Layout from '../components/layout'

const fetcher = (...args) => fetch(...args).then(res => res.json())

const formatter = new Intl.DateTimeFormat('en-GB', { month: 'numeric', day: 'numeric' })
const longDateFormatter = new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })

export default function CommunityIndices() {

  const { data, error } = useSWR('/api/community-indices', fetcher)

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
        <LineChart data={data.communityIndices} margin={{ top: 40, right: 60, bottom: 20, left: 0 }}>
          <Line type="stepAfter" name="Community Index Score" dataKey="value" stroke="#01c38d" strokeWidth={2} dot={false} />
          <CartesianGrid stroke="#ddd" strokeDasharray="3 3" />
          <XAxis tickMargin={10} dataKey="date" scale="time" type="number" interval={2} domain={['auto', 'auto']} tickFormatter={(timestamp) => formatter.format(timestamp)} />
          <YAxis tickMargin={10} unit="/10" domain={[0, 10]} tickCount={10} />
          <Tooltip formatter={(value, name, props) => [`${value}/10`, 'Score']} labelFormatter={(timestamp) => longDateFormatter.format(timestamp)} />
          <Legend iconType="plainline" align="center" wrapperStyle={{ paddingLeft: "52px", paddingTop: "18px" }} />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return (
    <Layout name="Community Index">
      {graph}
    </Layout>
  )
}
