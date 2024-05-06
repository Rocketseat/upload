import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useDictionary } from '@/state/dictionary'

export function WebhookLogsListLoading() {
  const dictionary = useDictionary()

  return (
    <div className="rounded border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead style={{ width: 172 }}>
              {dictionary.webhook_logs_list_time}
            </TableHead>
            <TableHead style={{ width: 72 }}>
              {dictionary.webhook_logs_list_status}
            </TableHead>
            <TableHead style={{ width: 200 }}>
              {dictionary.webhook_logs_list_destination}
            </TableHead>
            <TableHead style={{ width: 200 }}>
              {dictionary.webhook_logs_list_trigger}
            </TableHead>
            <TableHead>{dictionary.webhook_logs_list_request}</TableHead>
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
