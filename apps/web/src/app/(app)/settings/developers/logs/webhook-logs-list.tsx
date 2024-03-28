'use client'

import { dayjs } from '@nivo/dayjs'
import { webhookEventTrigger } from '@nivo/drizzle/schema'
import { keepPreviousData } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { trpc } from '@/lib/trpc/react'

import { WebhookLogsListLoading } from './webhook-logs-list-loading'

export function WebhookLogsList() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const trigger = searchParams.get('trigger')
    ? webhookEventTrigger.parse(searchParams.get('trigger'))
    : undefined

  const query = searchParams.get('query')

  const {
    data,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = trpc.getCompanyWebhookLogs.useInfiniteQuery(
    { limit: 15, trigger, query },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      placeholderData: keepPreviousData,
    },
  )

  if (isLoading) {
    return <WebhookLogsListLoading />
  }

  return (
    <div className="relative">
      <div className="rounded border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead style={{ width: 172 }}>
                <div className="flex items-center gap-2">
                  Time{' '}
                  {isFetching && (
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </TableHead>
              <TableHead style={{ width: 72 }}>Status</TableHead>
              <TableHead style={{ width: 200 }}>Destination</TableHead>
              <TableHead style={{ width: 200 }}>Trigger</TableHead>
              <TableHead>Request</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.pages?.map((page) => {
              return page.companyWebhookLogs.map((webhookLog) => {
                const webhookUrl = new URL(webhookLog.url)

                return (
                  <TableRow
                    key={webhookLog.id}
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(`/settings/developers/logs/${webhookLog.id}`)
                    }
                  >
                    <TableCell className="py-1.5">
                      <time className="ml-auto whitespace-nowrap font-mono text-xs text-muted-foreground">
                        {dayjs(webhookLog.createdAt).format('lll')}
                      </time>
                    </TableCell>

                    <TableCell className="py-1.5">
                      <Badge
                        variant="outline"
                        data-status={webhookLog.status}
                        className="px-1 font-mono font-normal data-[status=ERROR]:text-red-500 data-[status=SUCCESS]:text-green-700 dark:data-[status=ERROR]:text-red-500 dark:data-[status=SUCCESS]:text-green-500"
                      >
                        {webhookLog.httpCode}
                      </Badge>
                    </TableCell>

                    <TableCell className="py-1.5">
                      <span
                        title={webhookUrl.hostname.concat(webhookUrl.pathname)}
                        className="block truncate whitespace-nowrap font-mono text-xs"
                      >
                        {webhookUrl.hostname.concat(webhookUrl.pathname)}
                      </span>
                    </TableCell>

                    <TableCell className="py-1.5">
                      <span
                        title={webhookLog.trigger}
                        className="block truncate whitespace-nowrap font-mono text-xs"
                      >
                        {webhookLog.trigger}
                      </span>
                    </TableCell>

                    <TableCell className="py-1.5">
                      <span className="block truncate whitespace-nowrap font-mono text-xs text-muted-foreground">
                        {webhookLog.requestBody}
                      </span>
                    </TableCell>
                  </TableRow>
                )
              })
            })}
          </TableBody>
        </Table>
      </div>

      {data && hasNextPage && (
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-center justify-center bg-gradient-to-t from-white/40 to-white/0 py-4 dark:from-black/40 dark:to-black/0">
          <Button
            size="sm"
            className="pointer-events-auto w-36"
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              'Load more logs'
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
