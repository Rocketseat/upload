import { HardDrive } from 'lucide-react'
import { unstable_noStore } from 'next/cache'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { serverClient } from '@/lib/trpc/server'
import { formatBytes } from '@/utils/format-bytes'

export async function Storage({ dictionary }: { dictionary: Dictionary }) {
  unstable_noStore()

  const { storageOverall, storageLastMonth } =
    await serverClient.storageSummary()

  const formattedOverall = formatBytes(storageOverall ?? 0)
  const formattedLastMonth = formatBytes(storageLastMonth ?? 0)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">
          {dictionary.storage_title}
        </CardTitle>
        <HardDrive className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-1">
        <span className="text-2xl font-bold">{formattedOverall}</span>
        <p className="text-xs text-muted-foreground">
          {`+ ${formattedLastMonth} ${dictionary.storage_increase_last_month}`}
        </p>
      </CardContent>
    </Card>
  )
}
