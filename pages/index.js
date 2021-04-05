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

export default function Home() {

  const { data, error } = useSWR('/api/yields', fetcher)

  const CustomTooltip = ({ active, payload, label }) => {
    return (
      <div className="grid grid-cols-2 bg-gray-100 bg-opacity-90 border-2 border-gray-500 rounded-md p-3 text-sm">
        <div className="col-span-2 text-center border-b-2 border-gray-400 mb-2">{label}</div>
        {payload.map(y => <>
          <div className="pr-3 ">{y.dataKey}</div>
          <div className="text-right tabular-nums">{y.value.toFixed(2)}</div>
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
        <LineChart data={data.yields} margin={{ top: 20, right: 70, bottom: 0, left: 0 }}>
          {data.assets.map(asset => (
            <Line key={asset} type="stepAfter" dataKey={asset} stroke={assetsInfo[asset].color} strokeWidth={2} dot={false} unit="%" />
          ))}
          <CartesianGrid stroke="#ddd" strokeDasharray="3 3" />
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
        <script data-goatcounter="/api/count" async src="/count.js"></script>
      </Head>

      <main className="flex flex-col h-screen">

        <header className="p-10">
          <h1 className="text-4xl text-gray-800 font-bold">Yield Borg</h1>
          <p className="text-sm text-gray-600">Chart showing the evolution of the different <a href="http://swissborg.com/smart-yield-account">SwissBorg</a> Smart Yields</p>
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
