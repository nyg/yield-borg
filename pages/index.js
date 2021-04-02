import Head from 'next/head'

import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts'

import useSWR from 'swr'
const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function Home() {

  const { data, error } = useSWR('/api/yields', fetcher)

  const CustomTooltip = ({ active, payload, label }) => {
    console.log(payload)
    return (
      <div className="grid grid-cols-2 bg-gray-100 bg-opacity-90 border-2 border-gray-500 rounded-md p-3 text-sm">
        <div className="col-span-2 text-center border-b-2 border-gray-400 mb-2">{label}</div>
        {payload.map(y => <>
          <div key={y.dataKey} className="pr-3">{y.dataKey}</div>
          <div key={y.dataKey + y.value} className="text-right">{y.value.toFixed(2)}</div>
        </>)}
      </div>
    )
  }

  let graph
  if (error) {
    graph = <div>Failed to load data!</div>
  }
  else if (!data) {
    graph = <div>Loading data…</div>
  }
  else {
    graph = (
      <ResponsiveContainer width="100%" aspect={1.618}>
        <LineChart  data={data.yields} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <Line type="monotone" dataKey="USDC" stroke="blue" dot={false} unit="%" />
          <Line type="monotone" dataKey="CHSB" stroke="green" dot={false} unit="%" />
          <Line type="monotone" dataKey="ETH" stroke="violet" dot={false} unit="%" />
          <CartesianGrid stroke="#ddd" strokeDasharray="5 5" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip itemSorter={e => -e.value} content={<CustomTooltip />} />
          <Legend iconType="plainline" onClick={function (e) { console.log(e) }} />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return (
    <div>
      <Head>
        <title>Yield Borg</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="p-10">

        <header className="pb-8">
          <h1 className="text-4xl text-gray-800 font-bold">SwissBorg Smart Yields</h1>
          <p className="text-sm text-gray-600">Chart showing the evolution of SwissBorg's yields over time</p>
        </header>

        <div>
          {graph}
        </div>

        <footer></footer>
      </main>
    </div>
  )
}
