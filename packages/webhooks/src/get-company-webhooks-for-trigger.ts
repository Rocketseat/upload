import { db } from '@nivo/drizzle'
import { companyWebhook } from '@nivo/drizzle/schema'
import { and, arrayContains, eq } from 'drizzle-orm'
import { z } from 'zod'

import { webhookEventTriggerSchema } from './webhook-event-trigger'

const getCompanyWebhooksForTriggerParamsSchema = z.object({
  companyId: z.string().uuid(),
  trigger: webhookEventTriggerSchema,
})

type GetCompanyWebhooksForTriggerParams = z.infer<
  typeof getCompanyWebhooksForTriggerParamsSchema
>

export async function getCompanyWebhooksForTrigger({
  companyId,
  trigger,
}: GetCompanyWebhooksForTriggerParams) {
  const webhooks = await db
    .select({ id: companyWebhook.id, url: companyWebhook.url })
    .from(companyWebhook)
    .where(
      and(
        eq(companyWebhook.companyId, companyId),
        arrayContains(companyWebhook.triggers, [trigger]),
      ),
    )

  return webhooks
}
