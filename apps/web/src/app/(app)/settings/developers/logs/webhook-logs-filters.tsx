import { Filter, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

export async function WebhookLogsFilters() {
  return (
    <form className="flex items-center gap-2">
      <ToggleGroup defaultValue="all" type="single" variant="outline">
        <ToggleGroupItem
          className="h-8"
          value="all"
          aria-label="Show all webhook statuses"
        >
          <div className="flex items-center gap-2">
            <span className="size-2 shrink-0 rounded-full bg-zinc-400" />
            <span className="text-xs font-semibold">All</span>
          </div>
        </ToggleGroupItem>
        <ToggleGroupItem
          className="h-8"
          value="pending"
          aria-label="Filter pending webhooks"
        >
          <div className="flex items-center gap-2">
            <span className="size-2 shrink-0 rounded-full bg-amber-400" />
            <span className="text-xs font-semibold">Pending</span>
          </div>
        </ToggleGroupItem>
        <ToggleGroupItem
          className="h-8"
          value="success"
          aria-label="Filter success webhooks"
        >
          <div className="flex items-center gap-2">
            <span className="size-2 shrink-0 rounded-full bg-teal-400" />
            <span className="text-xs font-semibold">Success</span>
          </div>
        </ToggleGroupItem>
        <ToggleGroupItem
          className="h-8"
          value="error"
          aria-label="Filter error webhooks"
        >
          <div className="flex items-center gap-2">
            <span className="size-2 shrink-0 rounded-full bg-red-400" />
            <span className="text-xs font-semibold">Error</span>
          </div>
        </ToggleGroupItem>
      </ToggleGroup>

      <Separator orientation="vertical" className="h-6" />

      <Button type="submit" size="sm" variant="secondary">
        <Filter className="mr-2 size-3" />
        Filter
      </Button>

      <Button type="button" size="sm" variant="outline">
        <X className="mr-2 size-3" />
        Reset
      </Button>
    </form>
  )
}
