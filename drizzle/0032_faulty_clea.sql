CREATE TYPE "public"."order_status" AS ENUM('created', 'paid', 'failed', 'cancelled');--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "order_status" SET DATA TYPE "public"."order_status" USING "order_status"::text::"public"."order_status";--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "signature" DROP NOT NULL;--> statement-breakpoint
DROP TYPE "public"."orderStatus";