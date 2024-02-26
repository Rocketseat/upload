import { dayjs } from '@nivo/dayjs'

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
            {webhookLog.status === 'SUCCESS' && (
              <span className="size-2 shrink-0 rounded-full bg-teal-400" />
            )}

            {webhookLog.status === 'ERROR' && (
              <span className="size-2 shrink-0 rounded-full bg-red-400" />
            )}

            {webhookLog.status === 'PENDING' && (
              <span className="size-2 shrink-0 rounded-full bg-amber-400" />
            )}

            <Badge
              variant="secondary"
              className="w-12 justify-center border border-zinc-400 tabular-nums dark:border-zinc-700"
            >
              {webhookLog.httpCode ?? '-'}
            </Badge>
            <Badge
              variant="secondary"
              className="w-12 justify-center border border-zinc-400 tabular-nums dark:border-zinc-700"
            >
              {(webhookLog.trigger as string) ?? '-'}
            </Badge>

            <div className="flex items-baseline gap-2">
              <span className="font-mono text-sm font-semibold">
                {webhookLog.httpMethod}
              </span>
              <span className="text-xs text-muted-foreground">
                {webhookUrl.hostname.concat(webhookUrl.pathname)}
              </span>
            </div>
            <time className="ml-auto whitespace-nowrap text-sm text-muted-foreground">
              {dayjs(webhookLog.createdAt).fromNow()}
            </time>
          </NavLink>
        )
      })}
    </div>
  )
}
