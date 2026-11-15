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
