import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function WebhooksListLoading() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>URL</TableHead>
            <TableHead style={{ width: 120 }}>Triggers</TableHead>
            <TableHead style={{ width: 164 }}>
              <div className="flex flex-col">
                <span>Events</span>
                <span className="text-xxs text-muted-foreground">
                  (last 7 days)
                </span>
              </div>
            </TableHead>
            <TableHead style={{ width: 120 }} className="text-right">
              <div className="flex flex-col">
                <span>Success rate</span>
                <span className="text-xxs text-muted-foreground">
                  (last 7 days)
                </span>
              </div>
            </TableHead>
            <TableHead style={{ width: 64 }}>Status</TableHead>
            <TableHead style={{ width: 220 }}></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 2 }).map((_, row) => {
            return (
              <TableRow key={row}>
                <TableCell className="py-1.5">
                  <Skeleton className="h-5 w-48" />
                </TableCell>
                <TableCell className="py-1.5">
                  <Skeleton className="h-5 w-16" />
                </TableCell>
                <TableCell className="py-1.5">
                  <Skeleton className="h-8 w-full" />
                </TableCell>
                <TableCell className="py-1.5 text-right">
                  <Skeleton className="ml-auto h-6 w-8" />
                </TableCell>
                <TableCell className="py-1.5">
                  <Skeleton className="h-6 w-16" />
                </TableCell>
                <TableCell className="space-x-2 py-1.5">
                  <div className="flex items-center justify-end gap-2">
                    <Skeleton className="inline-block h-6 w-28" />
                    <Skeleton className="inline-block h-6 w-8" />
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
