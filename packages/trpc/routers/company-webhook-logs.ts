import { db } from '@nivo/drizzle'
import {
  companyWebhook,
  companyWebhookLog,
  webhookEventTrigger,
} from '@nivo/drizzle/schema'
import { and, desc, eq, getTableColumns, ilike, lt, sql } from 'drizzle-orm'
import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '../trpc'

export const companyWebhookLogsRouter = createTRPCRouter({
  getCompanyWebhookLogs: protectedProcedure
    .input(
      z.object({
        trigger: webhookEventTrigger.nullish(),
        query: z.string().nullish(),
        limit: z.number().min(1).max(100).default(10),
        cursor: z.date().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { companyId } = ctx.session.user
      const { limit, cursor, trigger, query } = input

      const companyWebhookLogs = await db
        .select({
          id: companyWebhookLog.id,
          createdAt: companyWebhookLog.createdAt,
          status: companyWebhookLog.status,
          httpCode: companyWebhookLog.httpCode,
          httpMethod: companyWebhookLog.httpMethod,
          url: companyWebhook.url,
          requestBody: companyWebhookLog.requestBody,
          trigger: sql<string>`${companyWebhookLog.requestBody}::json->>'trigger'`,
        })
        .from(companyWebhookLog)
        .innerJoin(
          companyWebhook,
          eq(companyWebhook.id, companyWebhookLog.companyWebhookId),
        )
        .where(
          and(
            eq(companyWebhook.companyId, companyId),
            cursor ? lt(companyWebhookLog.createdAt, cursor) : undefined,
            query
              ? ilike(companyWebhookLog.requestBody, `%${query}%`)
              : undefined,
            trigger
              ? eq(
                  sql`${companyWebhookLog.requestBody}::json->>'trigger'`,
                  trigger,
                )
              : undefined,
          ),
        )
        .orderBy(desc(companyWebhookLog.createdAt))
        .limit(limit + 1)

      const nextCursor =
        companyWebhookLogs.length > limit
          ? companyWebhookLogs.pop()?.createdAt
          : undefined

      return {
        companyWebhookLogs,
        nextCursor,
      }
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
