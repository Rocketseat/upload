import { dayjs } from '@nivo/dayjs'
import { z } from 'zod'

export const bunnyStatisticsSchema = z.object({
  viewsChart: z.record(z.string(), z.number()),
})

interface GetBunnyStatisticsParams {
  libraryId: string
  apiKey: string
}

export async function getBunnyStatistics({
  apiKey,
  libraryId,
}: GetBunnyStatisticsParams) {
  const url = new URL(
    `https://video.bunnycdn.com/library/${libraryId}/statistics`,
  )

  url.searchParams.set('dateFrom', dayjs().subtract(7, 'days').toISOString())
  url.searchParams.set('dateTo', new Date().toISOString())

  const response = await fetch(url, {
    headers: {
      AccessKey: apiKey,
    },
  })

  const data = await response.json()

  const statistics = bunnyStatisticsSchema.parse(data)

  return { statistics }
}
