import { AlertCircle } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

import { serverClient } from '@/lib/trpc/server'

import { UploadList } from './upload-list'

export const metadata: Metadata = {
  title: 'Upload',
  description: 'Upload new videos.',
}

export default async function Upload() {
  const { company } = await serverClient.getCurrentUserCompany()

  if (!company.externalId) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex max-w-96 items-start gap-4 rounded-md border p-6">
          <AlertCircle className="mt-1.5 size-6 shrink-0 text-amber-400" />
          <p className="leading-relaxed text-muted-foreground">
            Setup your{' '}
            <Link href="/app/settings/organization" className="underline">
              Bunny account integration
            </Link>{' '}
            before uploading videos on Nivo.
          </p>
        </div>
      </div>
    )
  }

  return <UploadList />
}
