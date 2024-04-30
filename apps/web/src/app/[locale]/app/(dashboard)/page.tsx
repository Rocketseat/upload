import { getDictionary, Locale } from '@nivo/i18n'
import { Metadata } from 'next'
import { Suspense } from 'react'

import { Loading } from '@/components/summary/loading'
import { Storage } from '@/components/summary/storage'
import { TotalCount } from '@/components/summary/total-count'

import { ViewsCount } from './cards/views-count'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export const revalidate = 900

export default async function DashboardPage({
  params: { locale },
}: {
  params: { locale: Locale }
}) {
  // using dictionary server side
  const dictionary = await getDictionary(locale)

  return (
    <>
      <h2 className="text-3xl font-bold tracking-tight">
        {dictionary.dashboard_heading}
      </h2>
      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-2">
          <Suspense fallback={<Loading />}>
            <TotalCount />
          </Suspense>
        </div>
        <div className="col-span-2">
          <Suspense fallback={<Loading />}>
            <Storage />
          </Suspense>
        </div>
        <div className="col-span-2">
          <Suspense fallback={<Loading />}>
            <ViewsCount />
          </Suspense>
        </div>
      </div>
    </>
  )
}
