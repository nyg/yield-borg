export const timeFrames = [
   { value: '7', label: '1W', name: '1 week' },
   { value: '14', label: '2W', name: '2 weeks' },
   { value: '30', label: '1M', name: '1 month' },
   { value: '90', label: '3M', name: '3 months' },
   { value: '180', label: '6M', name: '6 months' },
   { value: '365', label: '1Y', name: '1 year' },
   { value: 'all', label: 'All', name: 'All' },
] as const

export type TimeFrame = typeof timeFrames[number]['value']

export const lineTypes = [
   { value: 'monotone', label: 'Monotone' },
   { value: 'linear', label: 'Linear' },
   { value: 'step', label: 'Step' },
   { value: 'stepAfter', label: 'Step After' },
] as const

export type LineType = typeof lineTypes[number]['value']
