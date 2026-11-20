import Layout from '@/components/layout'
import YieldAverages from '@/components/yield/yield-averages'
import YieldChart from '@/components/yield/yield-chart'
import YieldChartSettings from '@/components/yield/yield-chart-settings'
import YieldStrategies from '@/components/yield/yield-strategies'
import { useAssetSelection } from '@/hooks/use-asset-selection'
import { usePreference } from '@/hooks/use-preference'
import { timeFrames } from '@/utils/chart-settings'

export default function SmartYields() {

   const [timeFrame, setTimeFrame] = usePreference('timeFrame', timeFrames, '90')
   const { selection, toggle } = useAssetSelection()

   return (
      <Layout name="Smart Yields" description="Daily APY of the SwissBorg Smart Yield strategies.">
         <YieldChartSettings timeFrame={timeFrame} onTimeFrameChange={setTimeFrame} />
         <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <YieldChart timeFrame={timeFrame} selection={selection} />
            <YieldStrategies timeFrame={timeFrame} selection={selection} onToggle={toggle} />
         </div>
         <YieldAverages selection={selection} />
      </Layout>
   )
}
