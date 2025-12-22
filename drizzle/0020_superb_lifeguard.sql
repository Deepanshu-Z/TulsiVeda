ALTER TABLE "ticket" ADD COLUMN "subject" text NOT NULL;--> statement-breakpoint
ALTER TABLE "mails" DROP COLUMN "subject";