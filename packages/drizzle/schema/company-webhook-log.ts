import { relations } from 'drizzle-orm'
import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

import { companyWebhook } from './company-webhook'

export const companyWebhookLogStatus = pgEnum('CompanyWebhookLogStatus', [
  'PENDING',
  'SUCCESS',
  'ERROR',
])

export const companyWebhookLog = pgTable(
  'company_webhook_logs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    companyWebhookId: uuid('company_webhook_id')
      .notNull()
      .references(() => companyWebhook.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    status: companyWebhookLogStatus('status').default('PENDING').notNull(),
    errorReason: text('error_reason'),
    httpCode: text('http_code'),
    httpMethod: text('http_method'),
    requestBody: text('request_body'),
    requestHeaders: text('request_headers'),
    responseBody: text('response_body'),
    numberOfRetries: integer('number_of_retries').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    finishedAt: timestamp('finished_at'),
  },
  (table) => {
    return {
      statusIdx: index('status_idx').on(table.status),
    }
  },
)

export const companyWebhookLogRelations = relations(
  companyWebhookLog,
  ({ one }) => ({
    companyWebhook: one(companyWebhook, {
      fields: [companyWebhookLog.companyWebhookId],
      references: [companyWebhook.id],
    }),
  }),
)
