ALTER TABLE "products" RENAME COLUMN "images" TO "galleryImages";--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "id" text PRIMARY KEY NOT NULL;