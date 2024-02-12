import { env } from '@nivo/env'
import { qstash } from '@nivo/qstash/client'

import { getCompanyWebhooksForTrigger } from './get-company-webhooks-for-trigger'
import { WebhookEvent } from './webhook-event'

export type PublishWebhookEventsParams = Parameters<typeof publishWebhookEvents>

export async function publishWebhookEvents<T extends WebhookEvent['trigger']>({
  companyId,
  trigger,
  events,
}: {
  companyId: string
  trigger: T
  events: Array<Extract<WebhookEvent, { trigger: T }>['payload']>
}) {
  const companyWebhooksForTrigger = await getCompanyWebhooksForTrigger({
    companyId,
    trigger,
  })

  if (companyWebhooksForTrigger.length === 0) {
    return
  }

  if (env.NODE_ENV === 'development' && env.QSTASH_PUBLISH_MESSAGES === false) {
    console.log(
      '---------------------------------',
      '\n',
      `[Skipped] [Webhook] Event: "${trigger}" [${deliverToUrls.join(', ')}]:`,
      '\n',
      JSON.stringify(events, null, 2),
      '\n',
      '---------------------------------',
    )

    return
  }

  await Promise.all(
    companyWebhooksForTrigger.flatMap(async (webhook) => {
      return events.map((payload) => {
        return qstash.publishJSON({
          topic: env.QSTASH_WEBHOOKS_TOPIC,
          contentBasedDeduplication: true,
          body: {
            deliverTo: webhook.url,
            companyWebhookId: webhook.id,
            trigger,
            payload,
          },
        })
      })
    }),
  )
}
