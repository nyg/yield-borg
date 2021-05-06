import React from 'react'
import * as format from '../utils/format'

export default function YieldTooltip({ active, payload, label }) {

  return (
    <div className="grid grid-cols-2 bg-gray-100 bg-opacity-95 border-2 border-gray-500 rounded-md p-3 text-sm">
      <div className="col-span-2 text-center border-b border-gray-400 mb-2">{format.asLongDate(label)}</div>
      {payload
        .sort((a, b) => b.value - a.value)
        .map(y => (
          <React.Fragment key={y.dataKey}>
            <div className="pr-3 ">{y.dataKey}</div>
            <div className="text-right tabular-nums">{format.asPercentage(y.value / 100)}</div>
          </React.Fragment>
        ))}
    </div>
  )
}