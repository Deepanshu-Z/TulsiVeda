CREATE TABLE "ticket" (
	"id" text PRIMARY KEY NOT NULL,
	"user_email" text,
	"createdAt" timestamp DEFAULT now(),
	"status" "status" DEFAULT 'pending'
);
--> statement-breakpoint
ALTER TABLE "replies" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "replies" CASCADE;--> statement-breakpoint
ALTER TABLE "mails" DROP CONSTRAINT "mails_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "mails" ADD COLUMN "ticket_id" text;--> statement-breakpoint
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_user_email_user_email_fk" FOREIGN KEY ("user_email") REFERENCES "public"."user"("email") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mails" ADD CONSTRAINT "mails_ticket_id_ticket_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."ticket"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mails" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "mails" DROP COLUMN "is_verified";--> statement-breakpoint
ALTER TABLE "mails" DROP COLUMN "status";