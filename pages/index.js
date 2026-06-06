import { useState } from 'react'
import Layout from '@/components/layout'
import YieldChartSettings from '@/components/yield/yield-chart-settings'
import YieldChart from '@/components/yield/yield-chart'
import YieldAverages from '@/components/yield/yield-averages'
import YieldInformation from '@/components/yield/yield-information'


export default function SmartYields() {

   const [settings, setSettings] = useState({})
   const [visibility, setVisibility] = useState({})

   return (
      <Layout name="Smart Yields">
         <div className="space-y-8">
            <YieldChartSettings onChange={setSettings} />
            <YieldChart settings={settings} onVisibilityChange={setVisibility} />
            <YieldInformation />
            <YieldAverages yieldRate={settings.yieldRate} visibility={visibility} />
         </div>
      </Layout>
   )
}
