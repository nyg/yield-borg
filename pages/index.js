import Layout from '../components/shared/layout'
import YieldChartSettings from '../components/yield/yield-chart-settings'
import YieldChart from '../components/yield/yield-chart'
import YieldAverages from '../components/yield/yield-averages'
import YieldInformation from '../components/yield/yield-information'


export default function SmartYields() {
   return (
      <Layout name="Smart Yields">
         <YieldChartSettings />
         <YieldChart />
         <YieldInformation className="ml-16 mr-16" />
         <YieldAverages className="ml-16 mr-16" />
      </Layout>
   )
}
