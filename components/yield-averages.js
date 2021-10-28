import useSWR from 'swr'
import * as format from '../utils/format'


export default function YieldAverages() {

  const { data, error } = useSWR('/api/yield-average')

  if (error) {
    return <div className="text-center pt-4">Failed to load yield averages!</div>
  }
  else if (!data) {
    return <div className="text-center pt-4">Loading yield averages…</div>
  }
  else {
    return (
      <table className="w-full text-right">
        <thead>
          <tr className="border-b border-gray-400">
            <th></th>
            {data.assets.map(asset => (
              <th key={asset} className="pb-1">{asset}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.yieldAverages.map(average => (
            <tr key={average.date} className="border-b border-gray-200">
              <td className="pb-1 pt-1">{format.asMonthYearDate(average.date)}</td>
              {data.assets.map(asset =>
                <td className="tabular-nums text-xs align-middle">
                  {average[asset]
                    ? format.asPercentage(average[asset])
                    : ''}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
}
