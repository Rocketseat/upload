DO $$ BEGIN
 CREATE TYPE "CompanyWebhookLogStatus" AS ENUM('PENDING', 'SUCCESS', 'ERROR');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "company_webhook_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_webhook_id" uuid NOT NULL,
	"status" "CompanyWebhookLogStatus" DEFAULT 'PENDING' NOT NULL,
	"http_code" text NOT NULL,
	"http_method" text NOT NULL,
	"request_body" text,
	"response_body" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "company_webhook_logs" ADD CONSTRAINT "company_webhook_logs_company_webhook_id_company_webhooks_id_fk" FOREIGN KEY ("company_webhook_id") REFERENCES "company_webhooks"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
