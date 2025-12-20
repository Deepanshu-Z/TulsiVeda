ALTER TYPE "public"."status" ADD VALUE 'replied';--> statement-breakpoint
CREATE TABLE "replies" (
	"id" text PRIMARY KEY NOT NULL,
	"mailId" text,
	"subject" text NOT NULL,
	"content" text NOT NULL,
	"replied_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "replies" ADD CONSTRAINT "replies_mailId_mails_id_fk" FOREIGN KEY ("mailId") REFERENCES "public"."mails"("id") ON DELETE no action ON UPDATE no action;