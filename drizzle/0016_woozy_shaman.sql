CREATE TYPE "public"."status" AS ENUM('pending', 'open', 'completed');--> statement-breakpoint
ALTER TABLE "mails" ADD COLUMN "status" "status" DEFAULT 'pending';