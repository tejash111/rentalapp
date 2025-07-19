ALTER TABLE "asset" DROP CONSTRAINT "asset_category_id_category_id_fk";
--> statement-breakpoint
ALTER TABLE "asset" ADD COLUMN "price" integer;--> statement-breakpoint
ALTER TABLE "asset" ADD CONSTRAINT "asset_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE cascade ON UPDATE no action;