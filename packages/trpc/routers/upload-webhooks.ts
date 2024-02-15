import { db } from '@nivo/drizzle'
import { uploadWebhook } from '@nivo/drizzle/schema'
import { and, desc, eq, getTableColumns } from 'drizzle-orm'
import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '../trpc'

export const uploadWebhooksRouter = createTRPCRouter({
  getUploadWebhooks: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
      }),
    )
    .query(async ({ input }) => {
      const { videoId } = input

      const webhooks = await db
        .select(getTableColumns(uploadWebhook))
        .from(uploadWebhook)
        .where(and(eq(uploadWebhook.uploadId, videoId)))
        .orderBy(desc(uploadWebhook.createdAt))

      return { webhooks }
    }),
})
