import { getDictionary, i18n, Locale } from '@nivo/i18n'
import { Metadata } from 'next'
import { Suspense } from 'react'

import { Loading } from '@/components/summary/loading'
import { Storage } from '@/components/summary/storage'
import { TotalCount } from '@/components/summary/total-count'
import { useDictionary } from '@/state/dictionary'

import { ViewsCount } from './cards/views-count'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export const revalidate = 900

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }))
}

export default async function DashboardPage({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const dictionaryFromLang = await getDictionary(lang)
  const { dictionary } = useDictionary(dictionaryFromLang, lang)

  return (
    <>
      <h2 className="text-3xl font-bold tracking-tight">
        {dictionary.dashboard.heading}
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
