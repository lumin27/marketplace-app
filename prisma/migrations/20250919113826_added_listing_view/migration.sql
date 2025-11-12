-- CreateTable
CREATE TABLE "public"."listing_views" (
    "id" TEXT NOT NULL,
    "listing_id" TEXT NOT NULL,
    "viewer_id" TEXT,
    "ip" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "listing_views_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."listing_views" ADD CONSTRAINT "listing_views_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
