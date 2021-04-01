import Head from 'next/head'

import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'

import useSWR from 'swr'
const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function Home() {

  const { data, error } = useSWR('/api/yields', fetcher)

  let graph
  if (error) {
    graph = <div>Failed to load data…</div>
  }
  else if (!data) {
    graph = <div>Loading data…</div>
  }
  else {
    graph = (
      <LineChart width={600} height={300} data={data.yields} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <Line type="monotone" dataKey="USDC" stroke="#444" />
        <Line type="monotone" dataKey="CHSB" stroke="#333" />
        <Line type="monotone" dataKey="ETH" stroke="#222" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
      </LineChart>
    )
  }

  return (
    <div>
      <Head>
        <title>Yield Borg</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {graph}
      </main>
    </div>
  )
}
