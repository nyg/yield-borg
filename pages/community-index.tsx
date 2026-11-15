import CommunityIndexChart from '@/components/community-index/community-index-chart'
import Layout from '@/components/layout'

export default function CommunityIndex() {
   return (
      <Layout name="Community Index" description="Weekly SwissBorg Community Index score, out of 10.">
         <CommunityIndexChart />
      </Layout>
   )
}
