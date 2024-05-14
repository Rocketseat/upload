import { AlertCircle } from 'lucide-react'
import Link from 'next/link'

import { serverClient } from '@/lib/trpc/server'

import { UploadList } from './upload-list'
import { Locale, getDictionary } from '@nivo/i18n'
import Head from 'next/head'

export default async function Upload({
  params: { locale },
}: {
  params: { locale: Locale }
}) {
  const dictionary = await getDictionary(locale)

  const { company } = await serverClient.getCurrentUserCompany()

  if (!company.externalId) {
    return (
      <>
        <Head>
          <title>{dictionary.upload_page_title}</title>
        </Head>
        <div className="flex flex-1 items-center justify-center">
          <div className="flex max-w-96 items-start gap-4 rounded-md border p-6">
            <AlertCircle className="mt-1.5 size-6 shrink-0 text-amber-400" />
            <p className="leading-relaxed text-muted-foreground">
              {dictionary.upload_no_bunny_account}{' '}
              <Link href="/app/settings/organization" className="underline">
                {dictionary.upload_bunny_account_link}
              </Link>{' '}
              {dictionary.upload_bunny_account_integration}
            </p>
          </div>
        </div>
      </>
    )
  }

  return <UploadList />
}
