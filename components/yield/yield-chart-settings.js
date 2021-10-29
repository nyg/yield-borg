import { useCookies } from 'react-cookie'

export default function YieldChartSettings() {

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

  return (
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
  )
}
