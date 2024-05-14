import { Metadata } from 'next'

import { BatchUploadList } from './batch-upload-list'
import { Locale, getDictionary } from '@nivo/i18n'

interface BatchPageProps {
  params: { id: string, locale: Locale }
}

export async function generateMetadata({
  params,
}: BatchPageProps): Promise<Metadata> {
  const dictionary = await getDictionary(params.locale)
  const id = params.id

  return {
    title: `${dictionary.batch_page_generate_metadata_title} ${id}`,
  }
}

export default async function BatchPage({ params }: BatchPageProps) {
  const dictionary = await getDictionary(params.locale)

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{dictionary.batch_page_header_title}</h2>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {dictionary.batch_page_refresh_notice}
          </span>
        </div>
      </div>

      <BatchUploadList batchId={params.id} />
    </>
  )
}
