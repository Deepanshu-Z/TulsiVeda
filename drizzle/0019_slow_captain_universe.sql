ALTER TABLE "ticket" RENAME COLUMN "user_email" TO "user_id";--> statement-breakpoint
ALTER TABLE "ticket" DROP CONSTRAINT "ticket_user_email_user_email_fk";
--> statement-breakpoint
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;