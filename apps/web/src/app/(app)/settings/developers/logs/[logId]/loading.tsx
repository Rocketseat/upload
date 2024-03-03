import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

export default async function WebhookLogsDetailsLoading() {
  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center gap-2">
        <Skeleton className="h-7 w-8" />
        <Skeleton className="h-7 w-20" />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell style={{ width: 140 }}>Execution ID</TableCell>
              <TableCell>
                <Skeleton className="h-4 w-52" />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>
                <Skeleton className="h-5 w-20" />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Error reason</TableCell>
              <TableCell>
                <Skeleton className="h-5 w-32" />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Number of retries</TableCell>
              <TableCell>
                <Skeleton className="h-5 w-20" />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>HTTP Status</TableCell>
              <TableCell>
                <Skeleton className="h-[22px] w-12" />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Started at</TableCell>
              <TableCell>
                <Skeleton className="h-5 w-40" />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Finished at</TableCell>
              <TableCell>
                <Skeleton className="h-5 w-40" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <Separator />
      <div className="space-y-2">
        <span className="text-sm font-semibold tracking-tight">
          Request Body
        </span>
        <Skeleton className="h-44 w-full" />
      </div>
    </div>
  )
}
