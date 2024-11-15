import got from 'got'
import { pgSql } from '../../../db/db'


export default async function fetchAndStoreCommunityIndex(req, res) {

   if (req.method !== 'POST') {
      res.status(405).send({ message: 'Only POST requests allowed' })
      return
   }

   const communityIndex = (await got('https://swissborg.com/page-data/sq/d/1105622776.json')
      .json())
      .data.sbAppFeed.communityIndex

   // this script runs every Wednesday
   const tuesday = new Date()
   tuesday.setDate(tuesday.getDate() - 1)

   await pgSql`INSERT INTO community_indices (date, value) VALUES(${tuesday}, ${communityIndex})`

   res.status(200).json({ status: 'success' })
}
