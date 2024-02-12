import { env } from '@nivo/env'
import { verifySignatureAppRouter } from '@nivo/qstash'
import { handleWebhookEvent, webhookEventSchema } from '@nivo/webhooks'
import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 300
export const preferredRegion = 'cle1'
export const runtime = 'edge'

async function handler(request: NextRequest) {
  const requestBody = await request.json()

  const webhookEvent = webhookEventSchema.parse(requestBody)

  const { success } = await handleWebhookEvent(webhookEvent)

  if (!success) {
    return new NextResponse(null, { status: 500 })
  }

  return new NextResponse(null, { status: 204 })
}

export const POST = env.QSTASH_VALIDATE_SIGNATURE
  ? verifySignatureAppRouter(handler)
  : handler
