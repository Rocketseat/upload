import { dayjs } from '@nivo/dayjs'
import { db } from '@nivo/drizzle'
import {
  companyWebhook,
  companyWebhookLog,
  webhookEventTrigger,
} from '@nivo/drizzle/schema'
import { and, count, eq, gte, sql } from 'drizzle-orm'
import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '../trpc'
import { generateSigningKey } from '../utils/generate-signing-key'

export const companyWebhooksRouter = createTRPCRouter({
  getAvailableTriggers: protectedProcedure.query(async () => {
    const triggers = [
      {
        trigger: 'upload.created',
        description: 'Occurs whenever a video is uploaded.',
      },
      {
        trigger: 'upload.transcription.created',
        description: 'Occurs whenever a transcription is generated.',
      },
      {
        trigger: 'upload.updated',
        description: 'Occurs whenever a video is updated.',
      },
      {
        trigger: 'upload.deleted',
        description: 'Occurs whenever a video is deleted.',
      },
      {
        trigger: 'tag.created',
        description: 'Occurs whenever a tag is created.',
      },
      {
        trigger: 'tag.deleted',
        description: 'Occurs whenever a tag is deleted.',
      },
    ] as const

    return { triggers }
  }),

  getCompanyWebhooks: protectedProcedure
    .input(
      z.object({
        pageIndex: z.coerce.number().default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { companyId } = ctx.session.user
      const { pageIndex } = input

      const pageSize = 5

      const sevenDaysAgo = dayjs().subtract(7, 'days').startOf('day').toDate()

      const amountOfLogsPerDatePerWebhook = db
        .$with('amount_of_logs_per_date_per_webhook')
        .as(
          db
            .select({
              companyWebhookId: companyWebhook.id,
              date: sql<string>/* sql */ `
              TO_CHAR(${companyWebhookLog.createdAt}, 'YYYY-MM-DD')
            `.as('date'),
              amount: count(companyWebhookLog.id).as('amount'),
            })
            .from(companyWebhookLog)
            .innerJoin(
              companyWebhook,
              eq(companyWebhook.id, companyWebhookLog.companyWebhookId),
            )
            .where(
              and(
                eq(companyWebhook.companyId, companyId),
                gte(companyWebhookLog.createdAt, sevenDaysAgo),
              ),
            )
            .groupBy(
              companyWebhook.id,
              sql/* sql */ `TO_CHAR(${companyWebhookLog.createdAt}, 'YYYY-MM-DD')`,
            ),
        )

      const successRatePerWebhook = db.$with('success_rate_per_webhook').as(
        db
          .select({
            companyWebhookId: companyWebhook.id,
            successRate: sql<number>`
            ROUND(
              (
                (
                  SUM(
                    CASE
                      WHEN ${companyWebhookLog.status} = 'SUCCESS' THEN 1
                      ELSE 0
                    END
                  ) * 100
                ) / COUNT(${companyWebhookLog.id})
              ),
              2
            )
          `
              .mapWith(Number)
              .as('success_rate'),
          })
          .from(companyWebhookLog)
          .innerJoin(
            companyWebhook,
            eq(companyWebhook.id, companyWebhookLog.companyWebhookId),
          )
          .where(
            and(
              eq(companyWebhook.companyId, companyId),
              gte(companyWebhookLog.createdAt, sevenDaysAgo),
            ),
          )
          .groupBy(companyWebhook.id),
      )

      const [companyWebhooks, [{ amount }]] = await Promise.all([
        db
          .with(amountOfLogsPerDatePerWebhook, successRatePerWebhook)
          .select({
            id: companyWebhook.id,
            url: companyWebhook.url,
            triggers: companyWebhook.triggers,
            signingKey: companyWebhook.signingKey,
            amountOfLogs: sql<{ date: string; amount: number }[]>/* sql */ `
            json_agg (
              json_build_object ('date', "date", 'amount', "amount")
            )
          `,
            successRate: successRatePerWebhook.successRate,
          })
          .from(companyWebhook)
          .leftJoin(
            amountOfLogsPerDatePerWebhook,
            eq(
              amountOfLogsPerDatePerWebhook.companyWebhookId,
              companyWebhook.id,
            ),
          )
          .leftJoin(
            successRatePerWebhook,
            eq(successRatePerWebhook.companyWebhookId, companyWebhook.id),
          )
          .where(eq(companyWebhook.companyId, companyId))
          .offset(pageIndex * pageSize)
          .limit(pageSize)
          .groupBy(companyWebhook.id, successRatePerWebhook.successRate),

        db
          .select({ amount: count() })
          .from(companyWebhook)
          .where(eq(companyWebhook.companyId, companyId)),
      ])

      const pageCount = Math.ceil(amount / pageSize)

      return { companyWebhooks, pageCount }
    }),

  createCompanyWebhook: protectedProcedure
    .input(
      z.object({
        url: z.string().url(),
        triggers: z.array(webhookEventTrigger),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { companyId } = ctx.session.user
      const { url, triggers } = input

      await db.insert(companyWebhook).values({
        companyId,
        url,
        triggers,
        signingKey: generateSigningKey(),
      })
    }),

  deleteCompanyWebhook: protectedProcedure
    .input(
      z.object({
        companyWebhookId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { companyId } = ctx.session.user
      const { companyWebhookId } = input

      await db
        .delete(companyWebhook)
        .where(
          and(
            eq(companyWebhook.companyId, companyId),
            eq(companyWebhook.id, companyWebhookId),
          ),
        )
    }),

  updateCompanyWebhook: protectedProcedure
    .input(
      z.object({
        companyWebhookId: z.string().uuid(),
        url: z.string().url(),
        triggers: z.array(webhookEventTrigger),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { companyId } = ctx.session.user
      const { companyWebhookId, url, triggers } = input

      await db
        .update(companyWebhook)
        .set({
          url,
          triggers,
        })
        .where(
          and(
            eq(companyWebhook.companyId, companyId),
            eq(companyWebhook.id, companyWebhookId),
          ),
        )
    }),
})
