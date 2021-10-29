import useSWR from 'swr'
import { useCookies } from 'react-cookie'
import Layout from '../components/layout'
import YieldChart from '../components/yield-chart'
import YieldAverageTable from '../components/yield-average-table'


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
      <div className="ml-16 mr-16">
        <YieldAverageTable />
      </div>
      <div className="ml-16 mr-16 space-y-4">
        <div>
          <span className="font-bold mr-4">Announcements</span>
          <a href="https://swissborg.com/blog/swissborg-launches-usdc-smart-yield">USDC</a> <small>Dec 14, 2020</small> •{' '}
          <a href="https://swissborg.com/blog/chsb-smart-yield">CHSB</a> <small>Jan 29, 2021</small> •{' '}
          <a href="https://swissborg.com/blog/eth-smart-yield">ETH</a> <small>Mar 19, 2021</small> •{' '}
          <a href="https://swissborg.com/blog/btc-smart-yield">BTC</a> <small>May 6, 2021</small> •{' '}
          <a href="https://swissborg.com/blog/bnb-smart-yield">BNB</a> <small>June 4, 2021</small> •{' '}
          <a href="https://swissborg.com/blog/usdt-smart-yield">USDT</a> <small>June 25, 2021</small> •{' '}
          <a href="https://swissborg.com/blog/xrp-smart-yield">XRP</a> <small>July 2, 2021</small> •{' '}
          <a href="https://swissborg.com/blog/polygon-smart-yield">MATIC</a> <small>Sept 2, 2021</small> •{' '}
          <a href="https://swissborg.com/blog/polygon-smart-yield">EURT</a> <small>Oct, 2021</small>
        </div>
        <div>
          <span className="font-bold mr-4">Smart Yield Reports</span>
          <a href="https://swissborg.com/blog/smart-yield-report-december-2020-january-2021">Dec &apos;20 & Jan &apos;21</a> •{' '}
          <a href="https://swissborg.com/blog/smart-yield-report-february-2021">Feb &apos;21</a> •{' '}
          <a href="https://swissborg.com/blog/smart-yield-report-march-2021">Mar &apos;21</a> •{' '}
          <a href="https://swissborg.com/blog/smart-yield-report-april-2021">Apr &apos;21</a> •{' '}
          <a href="https://swissborg.com/blog/smart-yield-report-may-2021">May &apos;21</a> •{' '}
          <a href="https://swissborg.com/blog/smart-yield-report-june-2021">June &apos;21</a> •{' '}
          <a href="https://swissborg.com/blog/smart-yield-report-july-2021">July &apos;21</a> •{' '}
          <a href="https://swissborg.com/blog/smart-yield-report-august-2021">Aug &apos;21</a> •{' '}
          <a href="https://swissborg.com/blog/smart-yield-report-september-2021">Sept &apos;21</a>
        </div>
      </div>
    </Layout>
  )
}
