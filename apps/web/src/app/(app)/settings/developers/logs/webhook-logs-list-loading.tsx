import { Skeleton } from '@/components/ui/skeleton'

export function WebhookLogsListLoading() {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 12 }).map((_, i) => {
        return (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-l-4 border-l-zinc-100 px-4 py-2.5 dark:border-l-zinc-900"
          >
            <Skeleton className="h-[22px] w-11" />
            <span className="font-mono text-sm font-semibold">
              <Skeleton className="h-5 w-8" />
            </span>
            <div className="flex flex-1 items-center justify-end gap-4 truncate font-mono text-sm">
              <span className="text-xs text-muted-foreground">
                <Skeleton className="h-4 w-60" />
              </span>
            </div>
            <time className="whitespace-nowrap text-sm text-muted-foreground">
              <Skeleton className="h-5 w-20" />
            </time>
          </div>
        )
      })}
    </div>
  )
}
