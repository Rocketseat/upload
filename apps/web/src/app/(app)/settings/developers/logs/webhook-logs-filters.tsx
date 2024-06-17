'use client'

import { webhookEventTrigger } from '@nivo/drizzle/schema'
import { Filter, Loader2, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

export function WebhookLogsFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPendingFilterTransition, startTransition] = useTransition()

  const [query, setQuery] = useState(searchParams.get('query') ?? '')

  const [trigger, setTrigger] = useState(
    searchParams.get('trigger') ?? undefined,
  )

  function handleFilter(event: FormEvent) {
    event.preventDefault()

    const params = new URLSearchParams(searchParams)

    if (query) {
      params.set('query', query)
    } else {
      params.delete('query')
    }

    if (trigger) {
      params.set('trigger', trigger)
    } else {
      params.delete('trigger')
    }

    startTransition(() => {
      router.push(`/settings/developers/logs?${params.toString()}`)
    })
  }

  function handleResetFilters() {
    setQuery('')
    setTrigger(undefined)

    const params = new URLSearchParams(searchParams)

    params.delete('query')
    params.delete('trigger')

    router.push(`/settings/developers/logs?${params.toString()}`)
  }

  const hasFilters = trigger !== undefined || query !== ''

  return (
    <form onSubmit={handleFilter} className="flex items-center gap-2">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter webhooks..."
        className="h-8 w-auto flex-1"
      />

      <Select
        key={trigger}
        value={trigger}
        onValueChange={setTrigger}
        name="trigger"
      >
        <SelectTrigger className="h-8 w-[164px]">
          <SelectValue placeholder="Trigger" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(webhookEventTrigger.Values).map((trigger) => {
            return (
              <SelectItem key={trigger} value={trigger}>
                {trigger}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>

      {/* <WebhookLogsListDateRangePicker /> */}

      <Separator orientation="vertical" className="h-6" />

      <Button type="submit" size="sm" variant="secondary">
        {isPendingFilterTransition ? (
          <Loader2 className="mr-2 size-3 animate-spin" />
        ) : (
          <Filter className="mr-2 size-3" />
        )}
        Filter
      </Button>

      <Button
        onClick={handleResetFilters}
        disabled={!hasFilters}
        type="button"
        size="sm"
        variant="outline"
      >
        <X className="mr-2 size-3" />
        Reset
      </Button>
    </form>
  )
}
