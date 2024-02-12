import { db } from '@nivo/drizzle'
import { companyWebhookLog } from '@nivo/drizzle/schema'
import { eq } from 'drizzle-orm'

import { WebhookEvent } from './webhook-event'

export async function handleWebhookEvent({
  deliverTo,
  companyWebhookId,
  trigger,
  payload,
}: WebhookEvent) {
  const webhookLogId = crypto.randomUUID()

  const requestBody = JSON.stringify({
    trigger,
    payload,
  })

  try {
    await db.insert(companyWebhookLog).values({
      id: webhookLogId,
      companyWebhookId,
      status: 'PENDING',
      httpMethod: 'POST',
      requestBody,
    })

    const response = await fetch(deliverTo, {
      method: 'POST',
      body: requestBody,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const httpCode = response.status.toString()
    const responseBody = await response.text()

    const isErrorResponse = !response.ok

    await db
      .update(companyWebhookLog)
      .set({
        responseBody,
        httpCode,
        errorReason: isErrorResponse
          ? `The endpoint "${deliverTo}" returned an error HTTP code.`
          : null,
        status: isErrorResponse ? 'ERROR' : 'SUCCESS',
        finishedAt: new Date(),
      })
      .where(eq(companyWebhookLog.id, webhookLogId))

    return { success: response.ok }
  } catch (err) {
    await db
      .update(companyWebhookLog)
      .set({
        status: 'ERROR',
        errorReason: `Failed to deliver the message to the endpoint, details: ${JSON.stringify(err)}`,
        finishedAt: new Date(),
      })
      .where(eq(companyWebhookLog.id, webhookLogId))

    return { success: false }
  }
}
