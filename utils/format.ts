const locale = 'en-GB'
const timeZone = 'UTC'

const shortDateFormatter = new Intl.DateTimeFormat(locale, { timeZone, month: 'short', day: 'numeric' })
const longDateFormatter = new Intl.DateTimeFormat(locale, { timeZone, year: 'numeric', month: 'short', day: 'numeric' })
const monthDateFormatter = new Intl.DateTimeFormat(locale, { timeZone, year: 'numeric', month: 'long' })
const shortMonthDateFormatter = new Intl.DateTimeFormat(locale, { timeZone, year: '2-digit', month: 'short' })
const yearFormatter = new Intl.DateTimeFormat(locale, { timeZone, year: 'numeric' })
const percentageFormatter = new Intl.NumberFormat(locale, { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 })
const decimalOneFormatter = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
const signedDecimalOneFormatter = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1, signDisplay: 'exceptZero' })

const dateFormat = (formatter: Intl.DateTimeFormat, timestamp: number) =>
   formatter.format(timestamp).replace(' ', ' ')

export function asDecimalOne(number: number) {
   return decimalOneFormatter.format(number)
}

export function asSignedDecimalOne(number: number) {
   return signedDecimalOneFormatter.format(number)
}

export function asShortDate(timestamp: number) {
   return dateFormat(shortDateFormatter, timestamp)
}

export function asLongDate(timestamp: number) {
   return dateFormat(longDateFormatter, timestamp)
}

export function asMonthYearDate(timestamp: number) {
   return dateFormat(monthDateFormatter, timestamp)
}

export function asShortMonthYearDate(timestamp: number) {
   return dateFormat(shortMonthDateFormatter, timestamp)
}

export function asYear(timestamp: number) {
   return yearFormatter.format(timestamp)
}

export function asPercentage(number: number) {
   return percentageFormatter.format(number)
}
