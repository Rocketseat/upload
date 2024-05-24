import Head from 'next/head'
import { ReactNode, Suspense } from 'react'

import { WebhookLogsFilters } from './webhook-logs-filters'
import { WebhookLogsList } from './webhook-logs-list'
import { setDictionary } from '@/utils/dictionary-server-side'
import { getDictionaryByLocale } from '@nivo/i18n'
import { Locale } from 'next/dist/compiled/@vercel/og/satori'

export default async function WebhookLogsLayout({ children, params: { locale } }: {
  children: ReactNode,
  params: { locale: Locale }
}) {
  const dictionary = await getDictionaryByLocale(locale)
  setDictionary(dictionary)

  return (
    <>
      <Head>
        <title>{dictionary.webhook_logs_layout_title}</title>
      </Head>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">
          {dictionary.webhook_logs_layout_title}
        </h2>
        <Suspense fallback={null}>
          <WebhookLogsFilters />
          <WebhookLogsList />
        </Suspense>
        <div>{children}</div>
      </div>
    </>
  )
}
