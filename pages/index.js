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
  const { data, error } = useSWR('/api/yields', fetcher)
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
      <div className="pl-16 mt-4 space-x-3">
        <label htmlFor="yield-rate">Yield Rate</label>
        <select id="yield-rate" value={cookies.yieldRate} onChange={changeYieldRate}>
          <option value="genesis">Genesis Premium</option>
          <option value="community">Community Premium</option>
          <option value="standard">Standard</option>
        </select>
        <label htmlFor="line-type">Line type</label>
        <select id="line-type" value={cookies.lineType} onChange={changeLineType}>
          <option value="monotone">Monotone</option>
          <option value="linear">Linear</option>
          <option value="step">Step</option>
          <option value="stepAfter">Step After</option>
        </select>
      </div>
      {chart}
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
