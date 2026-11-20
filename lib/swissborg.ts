import got from 'got'

export type AppFeed = Record<string, number | string | null>

type RankNode = { rankId: string, balanceThreshold: number, earnBoostMultiplier: number }
type UserGrowthItem = { date: string, verifiedUsersCount: number }
type BuybackItem = { buybacksStartDate: string, buybacksUSD: number }
type BurnTransaction = { amount: number, dateTime: string, url: string }

async function fetchFeed<T>(hash: string) {
   const response = await got(`https://swissborg.com/page-data/sq/d/${hash}.json`).json<{ data: T }>()
   return response.data
}

export async function fetchAppFeed() {
   const data = await fetchFeed<{ sbAppFeed: AppFeed }>('3043756154')
   return data.sbAppFeed
}

export async function fetchRankNodes() {
   const data = await fetchFeed<{ allRank: { nodes: RankNode[] } }>('3471574331')
   return data.allRank.nodes
}

export async function fetchUserGrowth() {
   const data = await fetchFeed<{ userGrowth: { items: UserGrowthItem[] } }>('3136815511')
   return data.userGrowth.items
}

export async function fetchBuybacks() {
   const data = await fetchFeed<{ cashbackBuybacks: { items: BuybackItem[] } }>('3207504446')
   return data.cashbackBuybacks.items
}

export async function fetchBurns() {
   const data = await fetchFeed<{ burnTransactions: { transactions: BurnTransaction[] } }>('1455234432')
   return data.burnTransactions.transactions
}
