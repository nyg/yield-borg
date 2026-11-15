import * as format from '@/utils/format'

const day = 24 * 60 * 60 * 1000

function calendarTicks(first: number, last: number, monthStep: number, daysOfMonth: number[]) {
   const start = new Date(first)
   const ticks = []

   for (let month = 0; ; month += monthStep) {
      const monthStart = Date.UTC(start.getUTCFullYear(), month, 1)
      if (monthStart > last) {
         return ticks
      }
      ticks.push(...daysOfMonth
         .map(dayOfMonth => monthStart + (dayOfMonth - 1) * day)
         .filter(tick => tick >= first && tick <= last))
   }
}

export function timeAxis(dates: number[]) {
   const first = dates[0] ?? 0
   const last = dates.at(-1) ?? 0
   const span = last - first

   if (span <= 45 * day) {
      return { ticks: dates, tickFormatter: format.asShortDate }
   }
   if (span <= 120 * day) {
      return { ticks: calendarTicks(first, last, 1, [1, 15]), tickFormatter: format.asShortDate }
   }
   if (span <= 400 * day) {
      return { ticks: calendarTicks(first, last, 1, [1]), tickFormatter: format.asShortDate }
   }
   if (span <= 3 * 365 * day) {
      return { ticks: calendarTicks(first, last, 3, [1]), tickFormatter: format.asShortMonthYearDate }
   }
   return { ticks: calendarTicks(first, last, 12, [1]), tickFormatter: format.asYear }
}
