CREATE TABLE "mails" (
	"id" text PRIMARY KEY NOT NULL,
	"user_email" text NOT NULL,
	"user_id" text,
	"subject" text NOT NULL,
	"content" text NOT NULL,
	"is_verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "mails" ADD CONSTRAINT "mails_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;