'use client'

import { dayjs } from '@nivo/dayjs'
import { Calendar as CalendarIcon } from 'lucide-react'
import * as React from 'react'
import { DateRange } from 'react-day-picker'
import { twMerge } from 'tailwind-merge'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDictionary } from '@/state/dictionary'

export function WebhookLogsListDateRangePicker() {
  const dictionary = useDictionary()
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: dayjs(new Date()).subtract(7, 'days').toDate(),
    to: new Date(),
  })

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={twMerge(
            'w-[240px] justify-start text-left font-normal',
            !date && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {date.from.toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                })}
                <span className="px-2 text-xs text-muted-foreground">
                  {' / '}
                </span>
                {date.to.toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                })}
              </>
            ) : (
              dayjs(date.from).format('ll')
            )
          ) : (
            dictionary.webhook_logs_date_picker_placeholder
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
        <Select>
          <SelectTrigger>
            <SelectValue
              placeholder={dictionary.webhook_logs_date_picker_select}
            />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="0">
              {dictionary.webhook_logs_date_picker_today}
            </SelectItem>
            <SelectItem value="1">
              {dictionary.webhook_logs_date_picker_tomorrow}
            </SelectItem>
            <SelectItem value="3">
              {dictionary.webhook_logs_date_picker_in_3_days}
            </SelectItem>
            <SelectItem value="7">
              {dictionary.webhook_logs_date_picker_in_a_week}
            </SelectItem>
          </SelectContent>
        </Select>
        <div className="rounded-md border">
          <Calendar
            mode="range"
            numberOfMonths={2}
            selected={date}
            onSelect={setDate}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
