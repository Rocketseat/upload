'use client'

import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { ClipboardCopy, Globe } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { trpc } from '@/lib/trpc/react'
import { useDictionary } from '@/state/dictionary'

import { CreateWebhook } from './create-webhook'
import { WebhookListItemActions } from './webhook-list-item-actions'
import { WebhooksListLoading } from './webhooks-list-loading'

const WebhookEventsChart = dynamic(() => import('./webhook-events-chart'), {
  ssr: false,
})

export function WebhooksList() {
  const dictionary = useDictionary()
  const router = useRouter()
  const searchParams = useSearchParams()
  const pageIndex = z.coerce
    .number()
    .default(0)
    .parse(searchParams.get('pageIndex'))

  const { data, isLoading } = trpc.getCompanyWebhooks.useQuery({
    pageIndex,
  })

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams],
  )

  function navigateToPage(pageIndex: number) {
    router.push(
      `/app/settings/developers?${createQueryString('pageIndex', String(pageIndex))}`,
    )
  }

  function handleCopySigningKey(signingKey: string) {
    navigator.clipboard.writeText(signingKey)
    toast.info(dictionary.webhooks_signing_key_copied)
  }

  const page = pageIndex + 1
  const hasPreviousPage = data ? page > 1 : false
  const hasNextPage = data ? page < data.pageCount : false

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <Label asChild>
            <span>{dictionary.webhooks_label}</span>
          </Label>
          <p className="text-[0.8rem] text-muted-foreground">
            {dictionary.webhooks_description}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {data ? (
            <span className="text-sm text-muted-foreground">
              {dictionary.webhooks_page_info
                .replace('{page}', page.toString())
                .replace('{pageCount}', data.pageCount.toString())}
            </span>
          ) : (
            <Skeleton className="h-5 w-20" />
          )}
          <Separator orientation="vertical" className="h-4" />
          <Button
            variant="outline"
            className="size-8 p-0"
            onClick={() => navigateToPage(pageIndex - 1)}
            disabled={!hasPreviousPage}
          >
            <span className="sr-only">{dictionary.webhooks_previous_page}</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8 p-0"
            onClick={() => navigateToPage(pageIndex + 1)}
            disabled={!hasNextPage}
          >
            <span className="sr-only">{dictionary.webhooks_next_page}</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-4" />
          <CreateWebhook />
        </div>
      </div>

      {isLoading ? (
        <WebhooksListLoading />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{dictionary.webhooks_list_loading_url}</TableHead>
                <TableHead style={{ width: 120 }}>
                  {dictionary.webhooks_list_loading_triggers}
                </TableHead>
                <TableHead style={{ width: 164 }}>
                  <div className="flex flex-col">
                    <span>{dictionary.webhooks_list_loading_events}</span>
                    <span className="text-xxs text-muted-foreground">
                      {dictionary.webhooks_list_loading_events_last_7_days}
                    </span>
                  </div>
                </TableHead>
                <TableHead style={{ width: 120 }} className="text-right">
                  <div className="flex flex-col">
                    <span>{dictionary.webhooks_list_loading_success_rate}</span>
                    <span className="text-xxs text-muted-foreground">
                      {
                        dictionary.webhooks_list_loading_success_rate_last_7_days
                      }
                    </span>
                  </div>
                </TableHead>
                <TableHead style={{ width: 64 }}>
                  {dictionary.webhooks_list_loading_status}
                </TableHead>
                <TableHead style={{ width: 220 }}></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.companyWebhooks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    {dictionary.webhooks_no_created}
                  </TableCell>
                </TableRow>
              )}

              {data?.companyWebhooks.map((webhook) => {
                return (
                  <TableRow key={webhook.id}>
                    <TableCell className="py-1.5">
                      <div className="flex items-center gap-2">
                        <Globe className="size-4 flex-shrink-0" />
                        <span className="truncate whitespace-nowrap font-medium">
                          {webhook.url}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-1.5">
                      <Tooltip>
                        <TooltipTrigger className="underline">
                          {webhook.triggers.length}{' '}
                          {dictionary.webhook_list_events}{' '}
                        </TooltipTrigger>
                        <TooltipContent className="max-w-96 text-center font-mono text-xs leading-relaxed">
                          {webhook.triggers.join(', ')}
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="py-1.5">
                      <WebhookEventsChart data={webhook.amountOfLogs} />
                    </TableCell>
                    <TableCell className="py-1.5 text-right font-medium">
                      {webhook.successRate
                        ? String(webhook.successRate).concat('%')
                        : '-'}
                    </TableCell>
                    <TableCell className="py-1.5">
                      <div className="flex items-center gap-2">
                        <span className="size-2 shrink-0 rounded-full bg-teal-400" />
                        <span className="text-xs font-semibold">
                          {dictionary.webhook_list_event_active}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-1.5">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          onClick={() =>
                            handleCopySigningKey(webhook.signingKey)
                          }
                          variant="link"
                          size="sm"
                        >
                          <ClipboardCopy className="mr-2 size-3" />
                          {dictionary.webhooks_signing_key}
                        </Button>

                        <WebhookListItemActions webhook={webhook} />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
