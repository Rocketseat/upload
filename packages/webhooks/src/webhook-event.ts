import { z } from 'zod'

import {
  tagCreatedSchema,
  tagDeletedSchema,
  uploadCreatedSchema,
  uploadDeletedSchema,
  uploadTranscriptionCreatedSchema,
  uploadUpdatedSchema,
} from './events'

export const webhookEventSchema = z.discriminatedUnion('trigger', [
  z.object({
    trigger: z.literal('upload.created'),
    deliverTo: z.string().url(),
    companyWebhookId: z.string().uuid(),
    numberOfRetries: z.number(),
    payload: uploadCreatedSchema,
  }),
  z.object({
    trigger: z.literal('upload.updated'),
    deliverTo: z.string().url(),
    companyWebhookId: z.string().uuid(),
    numberOfRetries: z.number(),
    payload: uploadUpdatedSchema,
  }),
  z.object({
    trigger: z.literal('upload.deleted'),
    deliverTo: z.string().url(),
    companyWebhookId: z.string().uuid(),
    numberOfRetries: z.number(),
    payload: uploadDeletedSchema,
  }),
  z.object({
    trigger: z.literal('upload.transcription.created'),
    deliverTo: z.string().url(),
    companyWebhookId: z.string().uuid(),
    numberOfRetries: z.number(),
    payload: uploadTranscriptionCreatedSchema,
  }),
  z.object({
    trigger: z.literal('tag.created'),
    deliverTo: z.string().url(),
    companyWebhookId: z.string().uuid(),
    numberOfRetries: z.number(),
    payload: tagCreatedSchema,
  }),
  z.object({
    trigger: z.literal('tag.deleted'),
    deliverTo: z.string().url(),
    companyWebhookId: z.string().uuid(),
    numberOfRetries: z.number(),
    payload: tagDeletedSchema,
  }),
])

export type WebhookEvent = z.infer<typeof webhookEventSchema>
