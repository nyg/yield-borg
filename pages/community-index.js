import useSWR from 'swr'
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import Layout from '../components/shared/layout'
import * as format from '../utils/format'


export default function CommunityIndices() {

  const { data, error } = useSWR('/api/community-index')

  if (error) {
    return <div className="text-center pt-4">Failed to load data!</div>
  }
  else if (!data) {
    return <div className="text-center pt-4">Loading data…</div>
  }

  return (
    <Layout name="Community Index">
      <ResponsiveContainer width="100%" aspect={1.618}>
        <LineChart data={data.communityIndices} margin={{ top: 0, right: 63.5, bottom: 0, left: 3.5 }}>
          <Line type="stepAfter" name="Community Index Score" dataKey="value" stroke="#01c38d" strokeWidth={2} dot={false} />
          <CartesianGrid stroke="#ddd" strokeDasharray="3 3" />
          <XAxis tickMargin={10} dataKey="date" scale="time" type="number" interval={2} domain={['auto', 'auto']} tickFormatter={format.asShortDate} />
          <YAxis tickMargin={10} unit="/10" domain={[0, 10]} tickCount={10} />
          <Tooltip formatter={value => [`${value}/10`, 'Score']} labelFormatter={format.asLongDate} />
          <Legend iconType="plainline" align="center" wrapperStyle={{ paddingLeft: '61px', paddingTop: '6px' }} />
        </LineChart>
      </ResponsiveContainer>
    </Layout>
  )
}
