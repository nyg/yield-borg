import type { SeriesStyle } from '@/utils/series-style'

export default function SeriesKey({ style }: { style?: SeriesStyle }) {
   return (
      <svg aria-hidden="true" width="24" height="8" viewBox="0 0 24 8" className="shrink-0">
         <line
            x1="0" y1="4" x2="24" y2="4" strokeWidth="2"
            stroke={style?.color ?? 'var(--border)'} strokeDasharray={style?.dash} />
      </svg>
   )
}
