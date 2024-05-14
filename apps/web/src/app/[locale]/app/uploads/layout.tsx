import { ReactNode, Suspense } from 'react'

import { UploadsFilters } from './uploads-filters'
import { Locale, getDictionary } from '@nivo/i18n'

export default async function Layout({ children, params: { locale } }: { children: ReactNode, params: { locale: Locale } }) {
  const dictionary = await getDictionary(locale)

  return (
    <>
      <h2 className="text-3xl font-bold tracking-tight">{dictionary.layout_uploads_title}</h2>

      <div className="space-y-4">
        <Suspense fallback={null}>
          <UploadsFilters />
        </Suspense>

        {children}
      </div>
    </>
  )
}
