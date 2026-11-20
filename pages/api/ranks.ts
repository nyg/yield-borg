import type { NextApiRequest, NextApiResponse } from 'next'

import { fetchRankNodes } from '@/lib/swissborg'
import type { Rank, RanksResponse } from '@/types/api'

type RankGroup = { first: string, last: string, boost: number }

const rankName = (rankId: string) => rankId.charAt(0) + rankId.slice(1).toLowerCase()

function groupLabel({ first, last }: RankGroup, isHighest: boolean) {
   if (first === last) {
      return rankName(first)
   }
   return isHighest ? `${rankName(first)} and above` : `${rankName(first)} to ${rankName(last)}`
}

function toRanks(nodes: Awaited<ReturnType<typeof fetchRankNodes>>): Rank[] {
   const groups = nodes
      .toSorted((a, b) => a.balanceThreshold - b.balanceThreshold)
      .reduce<RankGroup[]>((groups, node) => {
         const previous = groups.at(-1)
         if (previous?.boost === node.earnBoostMultiplier) {
            previous.last = node.rankId
         } else {
            groups.push({ first: node.rankId, last: node.rankId, boost: node.earnBoostMultiplier })
         }
         return groups
      }, [])

   const highestBoost = Math.max(...groups.map(group => group.boost))

   return groups
      .map((group, index) => ({
         value: group.first.toLowerCase(),
         label: groupLabel(group, index === groups.length - 1),
         multiplier: group.boost / highestBoost,
      }))
      .toReversed()
}

export default async function getRanks(_req: NextApiRequest, res: NextApiResponse<RanksResponse>) {
   const ranks = toRanks(await fetchRankNodes())
   res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800')
   res.status(200).json({ ranks })
}
