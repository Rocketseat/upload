import Head from 'next/head'
import { Suspense } from 'react'

import { Loading } from '@/components/summary/loading'
import { Storage } from '@/components/summary/storage'
import { TotalCount } from '@/components/summary/total-count'

import { ViewsCount } from './cards/views-count'
import { getDictionary, setDictionary } from '@/utils/dictionary-server-side'
import { Locale, getDictionaryByLocale } from '@nivo/i18n'

export const revalidate = 900

export default async function DashboardPage({
  params: { locale }
}: {
  params: { locale: Locale }
}) {
  const dictionaryByLocale = await getDictionaryByLocale(locale)
  setDictionary(dictionaryByLocale)
  const dictionary = getDictionary()

  return (
    <>
      <Head>
        <title>{dictionary.dashboard_page_title}</title>
      </Head>
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
