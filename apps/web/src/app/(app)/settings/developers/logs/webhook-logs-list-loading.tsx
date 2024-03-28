import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function WebhookLogsListLoading() {
  return (
    <div className="rounded border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead style={{ width: 172 }}>Time</TableHead>
            <TableHead style={{ width: 72 }}>Status</TableHead>
            <TableHead style={{ width: 200 }}>Destination</TableHead>
            <TableHead style={{ width: 200 }}>Trigger</TableHead>
            <TableHead>Request</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 15 }).map((_, i) => {
            return (
              <TableRow key={i}>
                <TableCell className="py-1.5">
                  <Skeleton className="h-4 w-36" />
                </TableCell>

                <TableCell className="py-1.5">
                  <Skeleton className="h-[22px] w-8" />
                </TableCell>

                <TableCell className="py-1.5">
                  <Skeleton className="h-4 w-40" />
                </TableCell>

                <TableCell className="py-1.5">
                  <Skeleton className="h-4 w-40" />
                </TableCell>

                <TableCell className="py-1.5">
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
