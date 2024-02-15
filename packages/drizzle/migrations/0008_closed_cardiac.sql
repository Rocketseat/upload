ALTER TABLE "company_webhooks" ADD COLUMN "signing_key" text DEFAULT '' NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "status_idx" ON "company_webhook_logs" ("status");