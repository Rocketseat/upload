import { dayjs } from '@nivo/dayjs'
import { Eye } from 'lucide-react'
import dynamic from 'next/dynamic'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { serverClient } from '@/lib/trpc/server'

const ViewsCountChart = dynamic(() => import('./views-count-chart'), {
  ssr: false,
})

export async function ViewsCount() {
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
}
