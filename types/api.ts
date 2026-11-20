export type AssetValues = {
   date: number
   [asset: string]: number | string
}

export type YieldResponse = {
   yields: AssetValues[]
   xTicks: number[]
   assets: string[]
}

export type YieldAverageResponse = {
   yieldAverages: AssetValues[]
   assets: string[]
}

export type CommunityIndexResponse = {
   communityIndices: { date: number, value: number | string }[]
}

export type MessageResponse = {
   message: string
}

export type Rank = {
   value: string
   label: string
   multiplier: number
}

export type RanksResponse = {
   ranks: Rank[]
}

export type PlatformStats = {
   date: number
   aumUsd: number | null
   yieldEarnedUsd: number | null
   weeklyVolumeUsd: number | null
   verifiedUsers: number | null
   borgHolders: number | null
   borgLockedPercentage: number | null
}

export type DatedValue = {
   date: number
   value: number
}

export type BorgBurn = DatedValue & {
   url: string
}

export type PlatformResponse = {
   stats: PlatformStats[]
   verifiedUsers: DatedValue[]
   buybacks: DatedValue[]
   burns: BorgBurn[]
}
