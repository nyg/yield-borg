import useSWR from 'swr'
import { useCookies } from 'react-cookie'
import Layout from '../components/layout'
import YieldChart from '../components/yield-chart'

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function SmartYields() {

  /* Cookies */
  const [cookies, setCookie] = useCookies()
  if (!cookies.lineType) {
    setCookie('lineType', 'monotone')
  }

  if (!cookies.yieldRate) {
    setCookie('yieldRate', 'genesis')
  }

  /* Selects' onChange callback */
  const changeLineType = event => setCookie('lineType', event.target.value)
  const changeYieldRate = event => setCookie('yieldRate', event.target.value)

  /* Chart */
  const { data, error } = useSWR('/api/yield', fetcher)
  let chart
  if (error) {
    console.debug('error')
    chart = <div className="text-center pt-4">Failed to load data!</div>
  }
  else if (!data) {
    console.debug('loading')
    chart = <div className="text-center pt-4">Loading data…</div>
  }
  else {
    console.debug('redraw')
    chart = <YieldChart data={data} />
  }

  return (
    <Layout name="Smart Yields">
      <div className="ml-16 mr-16 space-x-6">
        <span className="space-x-2">
          <label htmlFor="yield-rate">Yield Rate</label>
          <select id="yield-rate" value={cookies.yieldRate} onChange={changeYieldRate}>
            <option value="genesis">Genesis Premium</option>
            <option value="community">Community Premium</option>
            <option value="standard">Standard</option>
          </select>
        </span>
        <span className="space-x-2">
          <label htmlFor="line-type">Line type</label>
          <select id="line-type" value={cookies.lineType} onChange={changeLineType}>
            <option value="monotone">Monotone</option>
            <option value="linear">Linear</option>
            <option value="step">Step</option>
            <option value="stepAfter">Step After</option>
          </select>
        </span>
      </div>
      {chart}
      <div className="flex flex-row flex-wrap ml-16 mr-16 space-x-20">
        <div>
          <h2>Smart Yield Reports</h2>
          <ul>
            <li><a href="https://swissborg.com/blog/smart-yield-report-july-2021">July 2021</a></li>
            <li><a href="https://swissborg.com/blog/smart-yield-report-june-2021">June 2021</a></li>
            <li><a href="https://swissborg.com/blog/smart-yield-report-may-2021">May 2021</a></li>
            <li><a href="https://swissborg.com/blog/smart-yield-report-april-2021">April 2021</a></li>
            <li><a href="https://swissborg.com/blog/smart-yield-report-march-2021">March 2021</a></li>
            <li><a href="https://swissborg.com/blog/smart-yield-report-february-2021">February 2021</a></li>
            <li><a href="https://swissborg.com/blog/smart-yield-report-december-2020-january-2021">December 2020 & January 2021</a></li>
          </ul>
        </div>
        <div>
          <h2>Annoucements</h2>
          <ul>
            <li><a href="https://swissborg.com/blog/xrp-smart-yield">XRP: July 2nd, 2021</a></li>
            <li><a href="https://swissborg.com/blog/usdt-smart-yield">USDT: June 25th, 2021</a></li>
            <li><a href="https://swissborg.com/blog/bnb-smart-yield">BNB: June 4th, 2021</a></li>
            <li><a href="https://swissborg.com/blog/btc-smart-yield">BTC: May 6th, 2021</a></li>
            <li><a href="https://swissborg.com/blog/eth-smart-yield">ETH: March 19th, 2021</a></li>
            <li><a href="https://swissborg.com/blog/chsb-smart-yield">CHSB: January 29th, 2021</a></li>
            <li><a href="https://swissborg.com/blog/swissborg-launches-usdc-smart-yield">USDC: December 14th, 2020</a></li>
          </ul>
        </div>
      </div>
    </Layout>
  )
}
