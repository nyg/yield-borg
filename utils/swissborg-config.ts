export const yieldRates = [
   { value: 'genesis', label: 'Genesis & Generation', multiplier: 1 },
   { value: 'pioneer', label: 'Pioneer', multiplier: .875 },
   { value: 'community', label: 'Community', multiplier: .75 },
   { value: 'explorer', label: 'Explorer', multiplier: .625 },
   { value: 'standard', label: 'Standard', multiplier: .5 },
] as const

export type YieldRate = typeof yieldRates[number]['value']

export const multiplierFor = Object.fromEntries(
   yieldRates.map(rate => [rate.value, rate.multiplier])
) as Record<YieldRate, number>

export const defaultSelectedAssets = [
   'ADA (Kiln)',
   'ATOM (Kiln)',
   'AVAX (Benqi)',
   'SOL (Kyros)',
]

export function splitAssetName(asset: string) {
   const [, currency, protocol] = /^(.+) \((.+)\)$/.exec(asset) ?? []
   return { currency: currency ?? asset, protocol }
}
