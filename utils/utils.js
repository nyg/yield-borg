export const assetsOf = object =>
  Object.keys(object).filter(k => k != 'date')

export const forEachKeyOf = (object, fn) =>
  Object.keys(object).forEach(fn)

export const asyncForEachKeyOf = async (object, asyncFn) => {
  for (const key in object) {
    await asyncFn(key)
  }
}
