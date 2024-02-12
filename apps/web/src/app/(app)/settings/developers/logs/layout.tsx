import { Metadata } from 'next'
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
      <h2 className="text-2xl font-bold tracking-tight">Webhook logs</h2>
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
