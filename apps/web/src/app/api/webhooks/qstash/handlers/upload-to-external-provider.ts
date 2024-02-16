import { getBunnyStreamUrl } from '@nivo/bunny'
import { aesDecrypt } from '@nivo/crypto'
import { db } from '@nivo/drizzle'
import { upload } from '@nivo/drizzle/schema'
import { env } from '@nivo/env'
import { publishWebhookEvents } from '@nivo/webhooks'
import axios from 'axios'
import { BunnyCdnStream } from 'bunnycdn-stream'
import { eq } from 'drizzle-orm'

import { WebhookError } from '../errors/webhook-error'

export async function uploadToExternalProvider(videoId: string) {
  const sourceVideo = await db.query.upload.findFirst({
    where(fields, { eq }) {
      return eq(fields.id, videoId)
    },
    with: {
      company: {
        columns: {
          externalId: true,
          externalApiKey: true,
        },
      },
      tagToUploads: {
        with: {
          tag: {
            columns: {
              slug: true,
            },
          },
        },
      },
    },
  })

  if (!sourceVideo) {
    throw new WebhookError('Video not found.')
  }

  if (!sourceVideo.processedAt || !sourceVideo.storageKey) {
    throw new WebhookError("Video hasn't processed yet.")
  }

  if (!sourceVideo.company.externalId || !sourceVideo.company.externalApiKey) {
    throw new WebhookError('Company has no external connection.')
  }

  if (sourceVideo.externalProviderId) {
    /**
     * Video was already uploaded to external provider
     */

    return
  }

  const { ciphertext, iv } = sourceVideo.company.externalApiKey

  const apiKey = await aesDecrypt(ciphertext, iv, env.AES_ENCRYPTION_KEY)

  const bunny = new BunnyCdnStream({
    apiKey,
    videoLibrary: sourceVideo.company.externalId,
  })

  const videoDownloadURL = `https://pub-${env.CLOUDFLARE_UPLOAD_BUCKET_ID}.r2.dev/${videoId}.mp4`

  const { data } = await axios.get(videoDownloadURL, {
    responseType: 'stream',
  })

  const { guid: externalProviderId } = await bunny.createAndUploadVideo(data, {
    title: sourceVideo.title,
  })

  const streamUrl = getBunnyStreamUrl({
    libraryId: sourceVideo.company.externalId,
    videoId: externalProviderId,
  })

  await db
    .update(upload)
    .set({ externalProviderId, externalStreamUrl: streamUrl })
    .where(eq(upload.id, videoId))

  const tags = sourceVideo.tagToUploads.map((tagToUpload) => {
    return tagToUpload.tag.slug
  })

  await publishWebhookEvents({
    companyId: sourceVideo.companyId,
    trigger: 'upload.updated',
    events: [
      {
        id: sourceVideo.id,
        description: sourceVideo.description,
        duration: sourceVideo.duration,
        title: sourceVideo.title,
        tags,
        externalId: externalProviderId,
        streamUrl,
      },
    ],
  })
}
