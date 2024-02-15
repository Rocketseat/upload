import { dayjs } from '@nivo/dayjs'
import { getHighlighter } from 'shiki'

import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { serverClient } from '@/lib/trpc/server'

interface WebhookLogsDetails {
  params: {
    logId: string
  }
}

export default async function WebhookLogsDetails({
  params,
}: WebhookLogsDetails) {
  const { webhookLog } = await serverClient.getCompanyWebhookLog({
    companyWebhookLogId: params.logId,
  })

  const highlighter = await getHighlighter({
    langs: ['json'],
    themes: ['min-light', 'min-dark'],
  })

  const requestBodyHighlighted = webhookLog.requestBody
    ? highlighter.codeToHtml(
        JSON.stringify(JSON.parse(webhookLog.requestBody), null, 2),
        {
          lang: 'json',
          themes: {
            light: 'min-light',
            dark: 'min-dark',
          },
        },
      )
    : ''

  const responseBodyHighlighted = webhookLog.responseBody
    ? highlighter.codeToHtml(
        JSON.stringify(JSON.parse(webhookLog.responseBody), null, 2),
        {
          lang: 'json',
          themes: {
            light: 'min-light',
            dark: 'min-dark',
          },
        },
      )
    : ''

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center gap-2">
        <span className="truncate whitespace-nowrap text-xl font-bold tracking-tight">
          {webhookLog.httpMethod} {new URL(webhookLog.url).pathname}
        </span>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell style={{ width: 140 }}>Execution ID</TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {webhookLog.id}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>
                {webhookLog.status === 'SUCCESS' && (
                  <div className="flex items-center gap-2">
                    <span className="size-2 shrink-0 rounded-full bg-teal-400" />
                    <span className="font-semibold">Success</span>
                  </div>
                )}

                {webhookLog.status === 'ERROR' && (
                  <div className="flex items-center gap-2">
                    <span className="size-2 shrink-0 rounded-full bg-red-400" />
                    <span className="font-semibold">Error</span>
                  </div>
                )}

                {webhookLog.status === 'PENDING' && (
                  <div className="flex items-center gap-2">
                    <span className="size-2 shrink-0 rounded-full bg-amber-400" />
                    <span className="font-semibold">Pending</span>
                  </div>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Error reason</TableCell>
              <TableCell>{webhookLog.errorReason || '-'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>HTTP Status</TableCell>
              <TableCell>
                <Badge variant="secondary">{webhookLog.httpCode ?? '-'}</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Started at</TableCell>
              <TableCell>
                {dayjs(webhookLog.createdAt).format('MMMM D h:mm A')}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Finished at</TableCell>
              {webhookLog.finishedAt ? (
                <TableCell>
                  <div className="flex items-baseline gap-2">
                    {dayjs(webhookLog.finishedAt).format('MMMM D h:mm A')}
                    <span className="text-muted-foreground">/</span>
                    <span className="text-xs">
                      {dayjs(webhookLog.finishedAt).diff(
                        webhookLog.createdAt,
                        'seconds',
                      )}{' '}
                      second(s)
                    </span>
                  </div>
                </TableCell>
              ) : (
                <TableCell>-</TableCell>
              )}
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <Separator />
      {webhookLog.requestBody && (
        <div className="space-y-2">
          <span className="text-sm font-semibold tracking-tight">
            Request Body
          </span>
          <div
            className="bg-muted p-6 text-sm"
            dangerouslySetInnerHTML={{ __html: requestBodyHighlighted }}
          />
        </div>
      )}
      {webhookLog.responseBody && (
        <div className="space-y-2">
          <span className="text-sm font-semibold tracking-tight">
            Response Body
          </span>
          <div
            className="bg-muted p-6 text-sm"
            dangerouslySetInnerHTML={{ __html: responseBodyHighlighted }}
          />
        </div>
      )}
    </div>
  )
}
