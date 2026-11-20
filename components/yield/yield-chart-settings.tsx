import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useRank } from '@/hooks/use-rank'
import { type TimeFrame, timeFrames } from '@/utils/chart-settings'

const fieldLabel = 'text-xs font-normal text-muted-foreground'

type Option<T extends string> = { value: T, label: string }

type SettingSelectProps<T extends string> = {
   id: string
   label: string
   value: T
   options: readonly Option<T>[]
   onChange: (value: T) => void
}

function SettingSelect<T extends string>({ id, label, value, options, onChange }: SettingSelectProps<T>) {
   const select = (next: string) => {
      const option = options.find(option => option.value === next)
      if (option) {
         onChange(option.value)
      }
   }

   return (
      <div className="grid min-w-0 gap-1.5">
         <Label htmlFor={id} className={fieldLabel}>{label}</Label>
         <Select value={value} onValueChange={select}>
            <SelectTrigger id={id} className="w-full pointer-coarse:data-[size=default]:h-11 sm:min-w-36">
               <SelectValue />
            </SelectTrigger>
            <SelectContent>
               {options.map(option => (
                  <SelectItem key={option.value} value={option.value} className="pointer-coarse:min-h-11">
                     {option.label}
                  </SelectItem>
               ))}
            </SelectContent>
         </Select>
      </div>
   )
}

type YieldChartSettingsProps = {
   timeFrame: TimeFrame
   onTimeFrameChange: (timeFrame: TimeFrame) => void
}

export default function YieldChartSettings({
   timeFrame, onTimeFrameChange,
}: YieldChartSettingsProps) {

   const { ranks, rank, setRank } = useRank()

   const selectTimeFrame = (next: string) => {
      const option = timeFrames.find(option => option.value === next)
      if (option) {
         onTimeFrameChange(option.value)
      }
   }

   return (
      <div className="grid gap-3 sm:flex sm:flex-wrap sm:items-end sm:gap-x-4">
         <div className="grid gap-1.5">
            <span id="time-frame-label" className={fieldLabel}>Time frame</span>
            <ToggleGroup
               type="single" variant="outline" spacing={0} className="w-full sm:w-fit"
               aria-labelledby="time-frame-label"
               value={timeFrame} onValueChange={selectTimeFrame}>
               {timeFrames.map(option => (
                  <ToggleGroupItem
                     key={option.value} value={option.value} aria-label={option.name}
                     className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground pointer-coarse:h-11 sm:flex-none sm:px-3">
                     {option.label}
                  </ToggleGroupItem>
               ))}
            </ToggleGroup>
         </div>
         <SettingSelect id="rank" label="Rank" value={rank?.value ?? ''} options={ranks} onChange={setRank} />
      </div>
   )
}
