const locales = typeof navigator !== 'undefined' ? navigator.language : 'en-GB'

const shortDateFormatter = new Intl.DateTimeFormat(locales, { month: 'short', day: 'numeric' })
const longDateFormatter = new Intl.DateTimeFormat(locales, { year: 'numeric', month: 'short', day: 'numeric' })
const percentageFormatter = new Intl.NumberFormat(locales, { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 })

export function asLongDate(timestamp) {
  return longDateFormatter.format(timestamp)
}

export function asShortDate(timestamp) {
  return shortDateFormatter.format(timestamp)
}

export function asPercentage(number) {
  return percentageFormatter.format(number)
}
