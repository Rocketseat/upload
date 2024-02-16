import { db } from '@nivo/drizzle'
import { companyWebhook, companyWebhookLog } from '@nivo/drizzle/schema'
import { and, desc, eq, getTableColumns } from 'drizzle-orm'
import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '../trpc'

export const companyWebhookLogsRouter = createTRPCRouter({
  getCompanyWebhookLogs: protectedProcedure.query(async ({ ctx }) => {
    const { companyId } = ctx.session.user

    const companyWebhookLogs = await db
      .select({
        id: companyWebhookLog.id,
        createdAt: companyWebhookLog.createdAt,
        status: companyWebhookLog.status,
        httpCode: companyWebhookLog.httpCode,
        httpMethod: companyWebhookLog.httpMethod,
        url: companyWebhook.url,
      })
      .from(companyWebhookLog)
      .innerJoin(
        companyWebhook,
        eq(companyWebhook.id, companyWebhookLog.companyWebhookId),
      )
      .where(eq(companyWebhook.companyId, companyId))
      .orderBy(desc(companyWebhookLog.createdAt))
      .limit(50)

    return { companyWebhookLogs }
  }),

  getCompanyWebhookLog: protectedProcedure
    .input(z.object({ companyWebhookLogId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { companyWebhookLogId } = input
      const { companyId } = ctx.session.user

      const [webhookLog] = await db
        .select({
          ...getTableColumns(companyWebhookLog),
          url: companyWebhook.url,
        })
        .from(companyWebhookLog)
        .innerJoin(
          companyWebhook,
          eq(companyWebhook.id, companyWebhookLog.companyWebhookId),
        )
        .where(
          and(
            eq(companyWebhook.companyId, companyId),
            eq(companyWebhookLog.id, companyWebhookLogId),
          ),
        )

      return { webhookLog }
    }),
})
