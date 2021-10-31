import Layout from '../components/shared/layout'
import YieldChartSettings from '../components/yield/yield-chart-settings'
import YieldChart from '../components/yield/yield-chart'
import YieldTable from '../components/yield/yield-table'
import YieldInformation from '../components/yield/yield-information'


export default function SmartYields() {
  return (
    <Layout name="Smart Yields">
      <YieldChartSettings />
      <YieldChart />
      <YieldTable className="ml-16 mr-16" />
      <YieldInformation className="ml-16 mr-16" />
    </Layout>
  )
}
