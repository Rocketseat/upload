import { dayjs } from '@nivo/dayjs'
import { Eye } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { serverClient } from '@/lib/trpc/server'

const ViewsCountChart = dynamic(() => import('./views-count-chart'), {
  ssr: false,
})

export async function ViewsCount() {
  try {
    const { views } = await serverClient.viewsSummary()

    const categories = Object.keys(views).map((category) => {
      return dayjs(category).format('MMMM D')
    })

    const values = Object.values(views)

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">
            Views{' '}
            <span className="text-xs text-muted-foreground">(last 7 days)</span>
          </CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="h-[76px] p-0">
          <ViewsCountChart dates={categories} views={values} />
        </CardContent>
      </Card>
    )
  } catch (err) {
    return (
      <Card className="relative">
        <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-sm leading-relaxed text-muted-foreground">
          <Link href="/app/settings/organization" className="underline">
            Setup your Bunny account
          </Link>{' '}
          to see metrics
        </p>
        <div className="pointer-events-none opacity-80 blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              Views{' '}
              <span className="text-xs text-muted-foreground">
                (last 7 days)
              </span>
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="h-[76px] p-0">
            <ViewsCountChart
              dates={['', '', '', '', '', '', '']}
              views={[40, 30, 40, 10, 20, 50, 30]}
            />
          </CardContent>
        </div>
      </Card>
    )
  }
}
