import useSWR from 'swr'
import { useCookies } from 'react-cookie'
import Layout from '../components/layout'
import YieldChart from '../components/yield-chart'


export default function SmartYields() {

  /* Cookies */
  const [cookies, setCookie] = useCookies()
  if (!cookies.lineType) {
    setCookie('lineType', 'stepAfter', { maxAge: 315360000 })
  }

  if (!cookies.yieldRate) {
    setCookie('yieldRate', 'genesis', { maxAge: 315360000 })
  }

  if (!cookies.timeFrame) {
    setCookie('timeFrame', '180', { maxAge: 315360000 })
  }

  /* Selects' onChange callback */
  const changeLineType = event => setCookie('lineType', event.target.value, { maxAge: 315360000 })
  const changeYieldRate = event => setCookie('yieldRate', event.target.value, { maxAge: 315360000 })
  const changeTimeFrame = event => setCookie('timeFrame', event.target.value, { maxAge: 315360000 })

  /* Chart */
  const { data, error } = useSWR(`/api/yield?timeFrame=${cookies.timeFrame}`)

  let chart
  if (error) {
    chart = <div className="text-center pt-4">Failed to load data!</div>
  }
  else if (!data) {
    chart = <div className="text-center pt-4">Loading data…</div>
  }
  else {
    chart = <YieldChart data={data} />
  }

  return (
    <Layout name="Smart Yields">
      <div className="flex justify-center space-x-6">
        <span className="space-x-2">
          <label htmlFor="yield-rate">Yield rate</label>
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
        <span className="space-x-2">
          <label htmlFor="time-frame">Time frame</label>
          <select id="time-frame" value={cookies.timeFrame} onChange={changeTimeFrame}>
            <option value="7">1 week</option>
            <option value="14">2 weeks</option>
            <option value="30">1 month</option>
            <option value="90">3 months</option>
            <option value="180">6 months</option>
            <option value="365">1 year</option>
            <option value="all">All</option>
          </select>
        </span>
      </div>
      {chart}
      <div className="ml-16 mr-16 space-y-4">
        <div>
          <span className="font-bold mr-4">Smart Yield Reports</span>
          <a href="https://swissborg.com/blog/smart-yield-report-december-2020-january-2021">Dec 20 & Jan 21</a> •{' '}
          <a href="https://swissborg.com/blog/smart-yield-report-february-2021">Feb 21</a> •{' '}
          <a href="https://swissborg.com/blog/smart-yield-report-march-2021">Mar 21</a> •{' '}
          <a href="https://swissborg.com/blog/smart-yield-report-april-2021">Apr 21</a> •{' '}
          <a href="https://swissborg.com/blog/smart-yield-report-may-2021">May 21</a> •{' '}
          <a href="https://swissborg.com/blog/smart-yield-report-june-2021">June 21</a> •{' '}
          <a href="https://swissborg.com/blog/smart-yield-report-july-2021">July 21</a> •{' '}
          <a href="https://swissborg.com/blog/smart-yield-report-august-2021">Aug 21</a>
        </div>
        <div>
          <span className="font-bold mr-4">Annoucements</span>
          <a href="https://swissborg.com/blog/swissborg-launches-usdc-smart-yield">USDC</a> (Dec 14, 2020) •{' '}
          <a href="https://swissborg.com/blog/chsb-smart-yield">CHSB</a> (Jan 29, 2021) •{' '}
          <a href="https://swissborg.com/blog/eth-smart-yield">ETH</a> (Mar 19, 2021) •{' '}
          <a href="https://swissborg.com/blog/btc-smart-yield">BTC</a> (May 6, 2021) •{' '}
          <a href="https://swissborg.com/blog/bnb-smart-yield">BNB</a> (June 4, 2021) •{' '}
          <a href="https://swissborg.com/blog/usdt-smart-yield">USDT</a> (June 25, 2021) •{' '}
          <a href="https://swissborg.com/blog/xrp-smart-yield">XRP</a> (July 2, 2021) •{' '}
          <a href="https://swissborg.com/blog/polygon-smart-yield">MATIC</a> (Sept 2, 2021)
        </div>
      </div>
    </Layout>
  )
}
