import { dayjs } from '@nivo/dayjs'
import { ArrowDown } from 'lucide-react'

import { NavLink } from '@/components/nav-link'
import { Badge } from '@/components/ui/badge'
import { serverClient } from '@/lib/trpc/server'

export async function WebhookLogsList() {
  const { companyWebhookLogs } = await serverClient.getCompanyWebhookLogs()

  return (
    <div className="flex flex-col">
      {companyWebhookLogs.map((webhookLog) => {
        const webhookUrl = new URL(webhookLog.url)

        return (
          <NavLink
            href={`/settings/developers/logs/${webhookLog.id}`}
            key={webhookLog.id}
            className="flex items-center gap-4 border-b border-l-4 border-l-zinc-100 px-4 py-2.5 hover:bg-accent/50 data-[current=true]:border-l-teal-400 data-[current=true]:bg-accent dark:border-l-zinc-900 dark:data-[current=true]:border-l-teal-400"
          >
            <Badge
              variant="secondary"
              className="border border-zinc-400 dark:border-zinc-700"
            >
              {webhookLog.httpCode ?? '-'}
            </Badge>
            <span className="font-mono text-sm font-semibold">
              {webhookLog.httpMethod}
            </span>
            <div className="flex flex-1 items-center justify-end gap-4 truncate font-mono text-sm">
              <span className="text-xs text-muted-foreground">
                {webhookUrl.hostname.concat(webhookUrl.pathname)}
              </span>
            </div>
            <time className="whitespace-nowrap text-sm text-muted-foreground">
              {dayjs(webhookLog.createdAt).fromNow()}
            </time>
          </NavLink>
        )
      })}
      <button
        type="button"
        disabled
        className="flex items-center justify-center gap-2 border-b py-4 text-sm text-muted-foreground enabled:hover:bg-accent/50 disabled:opacity-50"
      >
        <ArrowDown className="size-3" />
        Load more...
      </button>
    </div>
  )
}
