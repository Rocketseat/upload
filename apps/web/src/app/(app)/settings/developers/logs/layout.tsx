import { Metadata } from 'next'
import { ReactNode } from 'react'

import { WebhookLogsFilters } from './webhook-logs-filters'
import { WebhookLogsList } from './webhook-logs-list'

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
      <WebhookLogsList />
      <div>{children}</div>
    </div>
  )
}
