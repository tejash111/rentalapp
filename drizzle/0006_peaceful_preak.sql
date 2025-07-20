ALTER TABLE "asset" ALTER COLUMN "price_per_day" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "asset" ALTER COLUMN "price" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "asset" ALTER COLUMN "price" SET NOT NULL;