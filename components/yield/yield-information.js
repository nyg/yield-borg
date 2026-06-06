import { Fragment } from 'react'
import * as format from '@/utils/format'
import ExternalLink from '@/components/lib/external-link'


const monthFormat = new Intl.DateTimeFormat('en-GB', { month: 'long' })
const monthString = date => monthFormat.format(date).toLowerCase()

const monthRange = () => {
   const dateFrom = new Date(2021, 0)
   const dateTo = new Date(2022, 8) // no more monthly reports published after that
   const monthCount = dateTo.getMonth() - dateFrom.getMonth() + 12 * (dateTo.getFullYear() - dateFrom.getFullYear())
   return [...Array(monthCount).keys()]
}

const separator = (index, array) => index < array.length - 1 && <span>&nbsp;• </span>

export default function YieldInformation({ className }) {

   const announcements = [
      { asset: 'USDC', url: 'swissborg-launches-usdc-smart-yield', date: new Date(2020, 11, 14) },
      { asset: 'CHSB', url: 'chsb-smart-yield', date: new Date(2021, 0, 29) },
      { asset: 'ETH', url: 'eth-smart-yield', date: new Date(2021, 2, 19) },
      { asset: 'BTC', url: 'btc-smart-yield', date: new Date(2021, 4, 6) },
      { asset: 'BNB', url: 'bnb-smart-yield', date: new Date(2021, 5, 4) },
      { asset: 'USDT', url: 'usdt-smart-yield', date: new Date(2021, 5, 25) },
      { asset: 'XRP', url: 'xrp-smart-yield', date: new Date(2021, 6, 2) },
      { asset: 'MATIC', url: 'polygon-smart-yield', date: new Date(2021, 8, 2) },
      { asset: 'EURT', url: 'yield-on-eurt', date: new Date(2021, 9, 15) },
   ]

   const reports = index => {
      const year = 2021 + Math.floor(index / 12)
      const month = index % 12
      const date = new Date(year, month)
      return index == 0
         ? { url: 'smart-yield-report-december-2020-january-2021', date }
         : { url: `smart-yield-report-${monthString(date)}-${year}`, date }
   }

   return (
      <div className={`${className ?? ''} space-y-4 text-sm text-muted-foreground`}>
         <p className="-indent-4 pl-4">
            <span className="font-semibold text-foreground mr-3">First announcements</span>
            {announcements.map(({ asset, url, date }, index, array) => (
               <Fragment key={index}>
                  <ExternalLink href={`https://swissborg.com/blog/${url}`} className="text-foreground">{asset}</ExternalLink>
                  <small suppressHydrationWarning>&nbsp;{format.asLongDate(date)}</small>
                  {separator(index, array)}
               </Fragment>
            ))}
         </p>
         <p className="-indent-4 pl-4">
            <span className="font-semibold text-foreground mr-3">Smart Yield Reports</span>
            {monthRange().map(reports).map(({ url, date }, index, array) => (
               <Fragment key={index}>
                  <ExternalLink href={`https://swissborg.com/blog/${url}`} className="text-foreground" suppressHydrationWarning>
                     {format.asShortMonthYearDate(date)}
                  </ExternalLink>
                  {separator(index, array)}
               </Fragment>
            ))}
         </p>
      </div>
   )
}
