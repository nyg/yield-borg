import Head from 'next/head'
import Image from 'next/image'

import useSWR from 'swr'
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts'

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
const longDateFormatter = new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })

export default function Home() {

  const { data, error } = useSWR('/api/yields', fetcher)

  const CustomTooltip = ({ active, payload, label }) => {
    return (
      <div className="grid grid-cols-2 bg-gray-100 bg-opacity-90 border-2 border-gray-500 rounded-md p-3 text-sm">
        <div className="col-span-2 text-center border-b-2 border-gray-400 mb-2">{longDateFormatter.format(label)}</div>
        {payload.sort((a, b) => b.value - a.value).map(y => <>
          <div key={y.dataKey} className="pr-3 ">{y.dataKey}</div>
          <div key={y.dataKey + 'val'} className="text-right tabular-nums">{y.value.toFixed(2)}</div>
        </>)}
      </div>
    )
  }

  let graph
  if (error) {
    graph = <div className="text-center">Failed to load data!</div>
  }
  else if (!data) {
    graph = <div className="text-center">Loading data…</div>
  }
  else {
    graph = (
      <ResponsiveContainer width="100%" aspect={1.618}>
        <LineChart data={data.yields} margin={{ top: 0, right: 3, bottom: 0, left: 10 }}>
          {data.assets.map(asset => (
            <Line key={asset} type="stepAfter" dataKey={asset} stroke={assetsInfo[asset].color} strokeWidth={2} dot={false} unit="%" />
          ))}
          <CartesianGrid stroke="#ddd" strokeDasharray="3 3" />
          <XAxis tickMargin={10} dataKey="date" scale="time" type="number" interval={7} domain={['auto', 'auto']} tickFormatter={(timestamp) => formatter.format(timestamp)} />
          <YAxis tickMargin={10} unit="%" />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="plainline" align="center" wrapperStyle={{ paddingLeft: "52px", paddingTop: "20px" }} />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return (
    <div>
      <Head>
        <title>Yield Borg</title>
        <link rel="icon" href="/favicon.ico" />
        <script data-goatcounter="/api/count" async src="/count.js"></script>
      </Head>

      <main className="flex flex-col h-screen text-gray-600">

        <header className="pt-10 pb-10 pl-16">
          <h1 className="text-4xl text-gray-800 font-bold">Yield Borg</h1>
          <p className="text-sm">Chart showing the evolution of the different <a href="http://swissborg.com/smart-yield-account">SwissBorg</a> Smart Yields</p>
        </header>

        <div className="text-sm">
          {graph}
        </div>

        <footer className="mt-auto pt-3 pb-3 text-center text-sm text-gray-500 space-x-6">
          <a href="https://github.com/nyg/yield-borg">
            <Image src="/gh-dark.png" alt="github" width="24" height="24" />
          </a>
          <a href="https://yield-borg.goatcounter.com">
            <Image src="/goatcounter.png" alt="goatcounter" width="24" height="24" />
          </a>
        </footer>
      </main>
    </div>
  )
}
