import { getBunnyStatistics } from '@nivo/bunny'
import { aesDecrypt } from '@nivo/crypto'
import { dayjs } from '@nivo/dayjs'
import { db } from '@nivo/drizzle'
import { upload } from '@nivo/drizzle/schema'
import { env } from '@nivo/env'
import { TRPCError } from '@trpc/server'
import { and, count, eq, gte, sum } from 'drizzle-orm'

import { createTRPCRouter, protectedProcedure } from '../trpc'

export const metricsRouter = createTRPCRouter({
  viewsSummary: protectedProcedure.query(async ({ ctx }) => {
    const { companyId } = ctx.session.user

    const company = await db.query.company.findFirst({
      columns: { externalId: true, externalApiKey: true },
      where(fields, { eq }) {
        return eq(fields.id, companyId)
      },
    })

    if (!company || !company.externalId || !company.externalApiKey) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'The company has not external connection.',
      })
    }

    const { ciphertext, iv } = company.externalApiKey

    const apiKey = await aesDecrypt(ciphertext, iv, env.AES_ENCRYPTION_KEY)

    const { statistics } = await getBunnyStatistics({
      apiKey,
      libraryId: company.externalId,
    })

    return { views: statistics.viewsChart }
  }),

  storageSummary: protectedProcedure.query(async ({ ctx }) => {
    const { companyId } = ctx.session.user

    const [[{ storageOverall }], [{ storageLastMonth }]] = await Promise.all([
      db
        .select({
          storageOverall: sum(upload.sizeInBytes).mapWith(Number),
        })
        .from(upload)
        .where(eq(upload.companyId, companyId)),

      db
        .select({
          storageLastMonth: sum(upload.sizeInBytes).mapWith(Number),
        })
        .from(upload)
        .where(
          and(
            gte(upload.createdAt, dayjs().subtract(30, 'days').toDate()),
            eq(upload.companyId, companyId),
          ),
        ),
    ])

    return { storageOverall, storageLastMonth }
  }),

  uploadsAmountSummary: protectedProcedure.query(async ({ ctx }) => {
    const { companyId } = ctx.session.user

    const [[{ amountOverall }], [{ amountLastMonth }]] = await Promise.all([
      db
        .select({ amountOverall: count().mapWith(Number) })
        .from(upload)
        .where(eq(upload.companyId, companyId)),

      db
        .select({
          amountLastMonth: count().mapWith(Number),
        })
        .from(upload)
        .where(
          and(
            gte(upload.createdAt, dayjs().subtract(30, 'days').toDate()),
            eq(upload.companyId, companyId),
          ),
        ),
    ])

    return {
      amountOverall,
      amountLastMonth,
    }
  }),
})
