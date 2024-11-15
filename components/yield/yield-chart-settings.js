import { useEffect } from 'react'
import { useCookies } from 'react-cookie'

const maxAge = { maxAge: 315360000 }


export default function YieldChartSettings() {

   const [cookies, setCookie] = useCookies()

   const updateCookie = (name, event) =>
      setCookie(name, event.target.value, maxAge)

   const initCookie = (name, value) =>
      !cookies[name] && setCookie(name, value, maxAge)

   useEffect(() => {
      initCookie('lineType', 'monotone')
      initCookie('yieldRate', 'genesis')
      initCookie('timeFrame', '90')
   }, [])

   return (
      <div className="flex justify-center space-x-6">
         <span className="space-x-2">
            <label htmlFor="yield-rate">Yield rate</label>
            <select id="yield-rate" value={cookies.yieldRate} onChange={e => updateCookie('yieldRate', e)}>
               <option value="genesis">Genesis & Generation</option>
               <option value="pioneer">Pioneer</option>
               <option value="community">Community</option>
               <option value="explorer">Explorer</option>
               <option value="standard">Standard</option>
            </select>
         </span>
         <span className="space-x-2">
            <label htmlFor="line-type">Line type</label>
            <select id="line-type" value={cookies.lineType} onChange={e => updateCookie('lineType', e)}>
               <option value="monotone">Monotone</option>
               <option value="linear">Linear</option>
               <option value="step">Step</option>
               <option value="stepAfter">Step After</option>
            </select>
         </span>
         <span className="space-x-2">
            <label htmlFor="time-frame">Time frame</label>
            <select id="time-frame" value={cookies.timeFrame} onChange={e => updateCookie('timeFrame', e)}>
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
