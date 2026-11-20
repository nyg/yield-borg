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
