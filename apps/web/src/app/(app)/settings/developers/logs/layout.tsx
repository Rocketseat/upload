import { ArrowLeft } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { ReactNode, Suspense } from 'react'

import { Separator } from '@/components/ui/separator'

import { WebhookLogsFilters } from './webhook-logs-filters'
import { WebhookLogsList } from './webhook-logs-list'
import { WebhookLogsListLoading } from './webhook-logs-list-loading'

export const metadata: Metadata = {
  title: 'Webhook logs',
}

export default async function WebhookLogsLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Link
          href="/settings/developers"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent-foreground"
        >
          <ArrowLeft className="size-4" />
          developer settings
        </Link>
        <h2 className="text-2xl font-bold tracking-tight">Webhook logs</h2>
      </div>
      <WebhookLogsFilters />
      <div className="grid grid-cols-[minmax(0,_1fr)_1px_minmax(0,_1fr)] border-t">
        <Suspense fallback={<WebhookLogsListLoading />}>
          <WebhookLogsList />
        </Suspense>
        <Separator orientation="vertical" className="h-full" />
        <div className="min-h-[400px]">{children}</div>
      </div>
    </div>
  )
}
