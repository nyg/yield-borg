import Layout from '@/components/layout'
import BorgBurnsChart from '@/components/platform/borg-burns-chart'
import BorgBurnsTable from '@/components/platform/borg-burns-table'
import BorgBuybacksChart from '@/components/platform/borg-buybacks-chart'
import PlatformStatTiles from '@/components/platform/platform-stat-tiles'
import VerifiedUsersChart from '@/components/platform/verified-users-chart'

export default function Platform() {
   return (
      <Layout name="Platform" description="SwissBorg platform activity and BORG token supply.">
         <PlatformStatTiles />
         <div className="grid gap-4 lg:grid-cols-2">
            <VerifiedUsersChart />
            <BorgBuybacksChart />
         </div>
         <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_24rem]">
            <BorgBurnsChart />
            <BorgBurnsTable />
         </div>
      </Layout>
   )
}
