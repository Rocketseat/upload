import { dayjs } from '@nivo/dayjs'
import { env } from '@nivo/env'
import { z } from 'zod'

export const bunnyStatisticsSchema = z.object({
  viewsChart: z.record(z.string(), z.number()),
})

export async function getBunnyStatistics(libraryId: string) {
  const url = new URL(
    `https://video.bunnycdn.com/library/${libraryId}/statistics`,
  )

  url.searchParams.set('dateFrom', dayjs().subtract(7, 'days').toISOString())
  url.searchParams.set('dateTo', new Date().toISOString())

  const response = await fetch(url, {
    headers: {
      AccessKey: env.BUNNY_API_KEY,
    },
  })

  const data = await response.json()

  const statistics = bunnyStatisticsSchema.parse(data)

  return { statistics }
}
