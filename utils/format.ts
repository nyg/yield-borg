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
const integerFormatter = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 })
const signedIntegerFormatter = new Intl.NumberFormat(locale, { maximumFractionDigits: 0, signDisplay: 'exceptZero' })
const usdFormatter = new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD', currencyDisplay: 'narrowSymbol', maximumFractionDigits: 0 })

// en-GB writes compact numbers as 1.2m, en-US as 1.2M
const compactLocale = 'en-US'
const compactFormatter = new Intl.NumberFormat(compactLocale, { notation: 'compact', maximumFractionDigits: 1 })
const compactUsdFormatter = new Intl.NumberFormat(compactLocale, { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 })

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

export function asInteger(number: number) {
   return integerFormatter.format(number)
}

export function asSignedInteger(number: number) {
   return signedIntegerFormatter.format(number)
}

export function asUsd(number: number) {
   return usdFormatter.format(number)
}

export function asCompactNumber(number: number) {
   return compactFormatter.format(number)
}

export function asCompactUsd(number: number) {
   return compactUsdFormatter.format(number)
}
