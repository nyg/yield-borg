const hueCount = 8
const dashPatterns = [undefined, '6 4', '2 4', '10 4 2 4', '14 5']

export type SeriesStyle = { color: string, dash: string | undefined }

export function seriesStyle(slot: number): SeriesStyle {
   return {
      color: `var(--chart-${slot % hueCount + 1})`,
      dash: dashPatterns[Math.floor(slot / hueCount) % dashPatterns.length],
   }
}
