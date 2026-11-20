export const yieldRates = [
   { value: 'platinum', label: 'Platinum and above', multiplier: 1 },
   { value: 'gold', label: 'Gold', multiplier: .875 },
   { value: 'silver', label: 'Silver', multiplier: .75 },
   { value: 'bronze', label: 'Bronze', multiplier: .625 },
   { value: 'standard', label: 'Standard', multiplier: .5 },
] as const

export type YieldRate = typeof yieldRates[number]['value']

export const multiplierFor = Object.fromEntries(
   yieldRates.map(rate => [rate.value, rate.multiplier])
) as Record<YieldRate, number>

export const defaultSelectedAssets = [
   'ATOM (Kiln)',
   'ETH (Lido)',
   'SOL (Kyros)',
   'USDC (Morpho)',
]

export function splitAssetName(asset: string) {
   const [, currency, protocol] = /^(.+) \((.+)\)$/.exec(asset) ?? []
   return { currency: currency ?? asset, protocol }
}
