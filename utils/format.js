const shortDateFormatter = new Intl.DateTimeFormat('en-GB', { month: 'short', day: 'numeric' })
const longDateFormatter = new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })
const percentageFormatter = new Intl.NumberFormat('en-GB', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 })

export function asLongDate(timestamp) {
  return longDateFormatter.format(timestamp)
}

export function asShortDate(timestamp) {
  return shortDateFormatter.format(timestamp)
}

export function asPercentage(number) {
  return percentageFormatter.format(number)
}