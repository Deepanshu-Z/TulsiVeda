CREATE TABLE "chats" (
	"id" text PRIMARY KEY NOT NULL,
	"ticket_id" text,
	"user_email" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DROP TABLE "mails" CASCADE;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_ticket_id_ticket_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."ticket"("id") ON DELETE no action ON UPDATE no action;