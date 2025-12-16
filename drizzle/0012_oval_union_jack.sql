CREATE TYPE "public"."states" AS ENUM('Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttarakhand', 'Uttar Pradesh', 'West Bengal');--> statement-breakpoint
CREATE TABLE "addresses" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"phoneNumber" varchar(15) NOT NULL,
	"houseNumber" text NOT NULL,
	"area" text NOT NULL,
	"pincode" text NOT NULL,
	"city" text NOT NULL,
	"state" "states" NOT NULL,
	"nearby" text,
	"isDefault" boolean DEFAULT false
);
--> statement-breakpoint
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;