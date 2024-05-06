import { dayjs } from '@nivo/dayjs'
import { getDictionary } from '@nivo/i18n'
import { Locale } from 'next/dist/compiled/@vercel/og/satori'
import { getHighlighter } from 'shiki'

import { InterceptedSheetContent } from '@/components/intercepted-sheet-content'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { serverClient } from '@/lib/trpc/server'

interface WebhookLogsDetails {
  params: {
    logId: string
    locale: Locale
  }
}

function getParsedText(text: string) {
  try {
    const textAsJSON = JSON.parse(text)

    return { code: JSON.stringify(textAsJSON, null, 2), lang: 'json' }
  } catch {
    return { code: text, lang: 'html' }
  }
}

export default async function WebhookLogsDetails({
  params: { logId, locale },
}: WebhookLogsDetails) {
  const dictionary = await getDictionary(locale)
  const { webhookLog } = await serverClient.getCompanyWebhookLog({
    companyWebhookLogId: logId,
  })

  const highlighter = await getHighlighter({
    langs: ['json', 'html'],
    themes: ['rose-pine-dawn', 'vesper'],
  })

  const parsedRequestBody = webhookLog.requestBody
    ? getParsedText(webhookLog.requestBody)
    : null

  const parsedRequestHeaders = webhookLog.requestHeaders
    ? getParsedText(webhookLog.requestHeaders)
    : null

  const parsedResponseBody = webhookLog.responseBody
    ? getParsedText(webhookLog.responseBody)
    : null

  const highlightedRequestBody = parsedRequestBody
    ? highlighter.codeToHtml(parsedRequestBody.code, {
        lang: parsedRequestBody.lang,
        themes: { light: 'rose-pine-dawn', dark: 'vesper' },
      })
    : null

  const highlightedRequestHeaders = parsedRequestHeaders
    ? highlighter.codeToHtml(parsedRequestHeaders.code, {
        lang: parsedRequestHeaders.lang,
        themes: { light: 'rose-pine-dawn', dark: 'vesper' },
      })
    : null

  const highlightedResponseBody = parsedResponseBody
    ? highlighter.codeToHtml(parsedResponseBody.code, {
        lang: parsedResponseBody.lang,
        themes: { light: 'rose-pine-dawn', dark: 'vesper' },
      })
    : null

  const nextRetryDelay = Math.round(
    Math.min(86400, Math.exp(2.5 * webhookLog.numberOfRetries)),
  )

  const nextRetryDate = dayjs(webhookLog.finishedAt).add(
    nextRetryDelay,
    'second',
  )

  const isNextRetryDateInFuture = nextRetryDate.isAfter(dayjs())

  const formattedNextRetryDate = isNextRetryDateInFuture
    ? dayjs().to(nextRetryDate, true)
    : ''

  const nextRetryDateFormatted = `(Next retry in ${formattedNextRetryDate.trim()})`

  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent className="overflow-auto">
        <SheetHeader>
          <SheetTitle>
            {webhookLog.httpMethod} {new URL(webhookLog.url).pathname}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4 py-4">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell style={{ width: 140 }}>
                  {dictionary.webhook_logs_details_execution_id}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {webhookLog.id}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{dictionary.webhook_logs_details_status}</TableCell>
                <TableCell>
                  {webhookLog.status === 'SUCCESS' && (
                    <div className="flex items-center gap-2">
                      <span className="size-2 shrink-0 rounded-full bg-teal-400" />
                      <span className="font-semibold">
                        {dictionary.webhook_logs_details_success}
                      </span>
                    </div>
                  )}

                  {webhookLog.status === 'ERROR' && (
                    <div className="flex items-center gap-2">
                      <span className="size-2 shrink-0 rounded-full bg-red-400" />
                      <span className="font-semibold">
                        {dictionary.webhook_logs_details_error}
                      </span>
                    </div>
                  )}

                  {webhookLog.status === 'PENDING' && (
                    <div className="flex items-center gap-2">
                      <span className="size-2 shrink-0 rounded-full bg-amber-400" />
                      <span className="font-semibold">
                        {dictionary.webhook_logs_details_pending}
                      </span>
                    </div>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {dictionary.webhook_logs_details_error_reason}
                </TableCell>
                <TableCell>{webhookLog.errorReason || '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {dictionary.webhook_logs_details_number_of_retries}
                </TableCell>
                <TableCell>
                  {webhookLog.status === 'ERROR'
                    ? `${webhookLog.numberOfRetries} ${
                        isNextRetryDateInFuture ? nextRetryDateFormatted : ''
                      }`
                    : '-'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {dictionary.webhook_logs_details_http_status}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {webhookLog.httpCode ?? '-'}
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {dictionary.webhook_logs_details_started_at}
                </TableCell>
                <TableCell>
                  {dayjs(webhookLog.createdAt).format('MMMM D h:mm A')}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {dictionary.webhook_logs_details_finished_at}
                </TableCell>
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
          <Separator />
          {highlightedRequestHeaders && (
            <div className="space-y-2">
              <span className="text-sm font-semibold tracking-tight">
                {dictionary.webhook_logs_details_request_headers}
              </span>
              <div
                className="max-h-72 overflow-y-scroll bg-muted p-6 text-sm"
                dangerouslySetInnerHTML={{ __html: highlightedRequestHeaders }}
              />
            </div>
          )}
          {highlightedRequestBody && (
            <div className="space-y-2">
              <span className="text-sm font-semibold tracking-tight">
                {dictionary.webhook_logs_details_request_body}
              </span>
              <div
                className="max-h-72 overflow-y-scroll bg-muted p-6 text-sm"
                dangerouslySetInnerHTML={{ __html: highlightedRequestBody }}
              />
            </div>
          )}
          {highlightedResponseBody && (
            <div className="space-y-2">
              <span className="text-sm font-semibold tracking-tight">
                {dictionary.webhook_logs_details_response_body}
              </span>
              <div
                className="max-h-72 overflow-y-scroll bg-muted p-6 text-sm"
                dangerouslySetInnerHTML={{ __html: highlightedResponseBody }}
              />
            </div>
          )}
        </div>
      </InterceptedSheetContent>
    </Sheet>
  )
}
