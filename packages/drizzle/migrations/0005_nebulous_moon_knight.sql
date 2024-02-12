ALTER TABLE "company_webhook_logs" ALTER COLUMN "http_code" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "company_webhook_logs" ALTER COLUMN "http_method" DROP NOT NULL;