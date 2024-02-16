import { aesEncrypt } from '@nivo/crypto'
import { db } from '@nivo/drizzle'
import { company } from '@nivo/drizzle/schema'
import { env } from '@nivo/env'
import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '../trpc'

export const companiesRouter = createTRPCRouter({
  setBunnyLibraryAndAPIKey: protectedProcedure
    .input(
      z.object({
        libraryId: z.string(),
        libraryName: z.string(),
        apiKey: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { apiKey, libraryId } = input
      const { companyId } = ctx.session.user

      const companyToUpdate = await db.query.company.findFirst({
        where(fields, { eq }) {
          return eq(fields.id, companyId)
        },
      })

      if (!companyToUpdate) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
        })
      }

      if (companyToUpdate.externalId) {
        throw new TRPCError({
          code: 'CONFLICT',
          message:
            'You cannot update the Bunny Library ID after setting it before.',
        })
      }

      const { ciphertext, iv } = await aesEncrypt(
        apiKey,
        env.AES_ENCRYPTION_KEY,
      )

      await db
        .update(company)
        .set({
          externalId: libraryId,
          externalApiKey: {
            ciphertext,
            iv,
          },
        })
        .where(eq(company.id, companyId))
    }),
})
