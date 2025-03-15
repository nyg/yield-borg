export const toISODate = date =>
   date.toISOString().substring(0, 10)

export const assetsOf = object =>
   Object.keys(object).filter(k => k != 'date')

export const forEachKeyOf = (object, fn) =>
   Object.keys(object).forEach(fn)

export const asyncForEachKeyOf = async (object, asyncFn) => {
   for (const key in object) {
      await asyncFn(key)
   }
}

const monthFormat = new Intl.DateTimeFormat('en-GB', { month: 'long' })
export const monthString = date =>
   monthFormat.format(date).toLowerCase()

export const monthRange = () => {
   const dateFrom = new Date(2021, 0)
   const dateTo = new Date(2022, 8) // no more monthly reports published after that
   const monthCount = dateTo.getMonth() - dateFrom.getMonth() + 12 * (dateTo.getFullYear() - dateFrom.getFullYear())
   return [...Array(monthCount).keys()]
}
