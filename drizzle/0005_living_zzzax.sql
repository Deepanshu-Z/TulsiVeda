CREATE TYPE "public"."categories" AS ENUM('Uncategorized', 'Health & Fitness', 'Suppliments', 'Skin', 'Hygiene');--> statement-breakpoint
CREATE TYPE "public"."roles" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "cart" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text,
	CONSTRAINT "cart_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "cartItems" (
	"id" text PRIMARY KEY NOT NULL,
	"cartId" text NOT NULL,
	"productId" text NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" "categories" DEFAULT 'Uncategorized' NOT NULL,
	"description" text,
	"price" integer NOT NULL,
	"discount_price" integer,
	"in_stock" boolean DEFAULT true NOT NULL,
	"images" jsonb NOT NULL,
	"form" varchar(50),
	"goal" jsonb,
	"ingredients" jsonb,
	"allergens" jsonb,
	"warnings" jsonb,
	"directions" text,
	"certifications" jsonb,
	"expiry_date" timestamp,
	"manufactured_date" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ratings" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"comments" jsonb,
	"images" jsonb
);
--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cartItems" ADD CONSTRAINT "cartItems_cartId_cart_id_fk" FOREIGN KEY ("cartId") REFERENCES "public"."cart"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cartItems" ADD CONSTRAINT "cartItems_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_id_unique" UNIQUE("id");