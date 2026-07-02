const { Client } = require('pg');
require('dotenv').config({ path: 'apps/server/.env' });
// fallback to root .env
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  await client.connect();
  
  const query = `
    DO $$ BEGIN
        CREATE TYPE "InteractionType" AS ENUM ('VIEW', 'ADD_TO_CART', 'REMOVE_FROM_CART', 'PURCHASE', 'WISHLIST');
    EXCEPTION
        WHEN duplicate_object THEN null;
    END $$;

    DROP TABLE IF EXISTS "search_queries" CASCADE;
    DROP TABLE IF EXISTS "product_interactions" CASCADE;
    DROP TABLE IF EXISTS "page_visits" CASCADE;
    DROP TABLE IF EXISTS "tracking_sessions" CASCADE;

    CREATE TABLE "tracking_sessions" (
        "id" UUID NOT NULL DEFAULT gen_random_uuid(),
        "cookieId" TEXT NOT NULL,
        "userId" UUID,
        "deviceType" TEXT,
        "browser" TEXT,
        "os" TEXT,
        "country" TEXT,
        "ipAddress" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "tracking_sessions_pkey" PRIMARY KEY ("id")
    );

    CREATE TABLE "page_visits" (
        "id" UUID NOT NULL DEFAULT gen_random_uuid(),
        "sessionId" UUID NOT NULL,
        "userId" UUID,
        "path" TEXT NOT NULL,
        "title" TEXT,
        "referrer" TEXT,
        "utmSource" TEXT,
        "utmMedium" TEXT,
        "utmCampaign" TEXT,
        "durationSeconds" INTEGER DEFAULT 0,
        "maxScrollDepth" DOUBLE PRECISION DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "page_visits_pkey" PRIMARY KEY ("id")
    );

    CREATE TABLE "product_interactions" (
        "id" UUID NOT NULL DEFAULT gen_random_uuid(),
        "sessionId" UUID NOT NULL,
        "userId" UUID,
        "productId" UUID NOT NULL,
        "type" "InteractionType" NOT NULL,
        "metadata" JSONB,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "product_interactions_pkey" PRIMARY KEY ("id")
    );

    CREATE TABLE "search_queries" (
        "id" UUID NOT NULL DEFAULT gen_random_uuid(),
        "sessionId" UUID NOT NULL,
        "userId" UUID,
        "query" TEXT NOT NULL,
        "resultsCount" INTEGER NOT NULL DEFAULT 0,
        "filters" JSONB,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "search_queries_pkey" PRIMARY KEY ("id")
    );

    CREATE UNIQUE INDEX IF NOT EXISTS "tracking_sessions_cookieId_key" ON "tracking_sessions"("cookieId");
    CREATE INDEX IF NOT EXISTS "tracking_sessions_cookieId_idx" ON "tracking_sessions"("cookieId");
    CREATE INDEX IF NOT EXISTS "tracking_sessions_userId_idx" ON "tracking_sessions"("userId");
    
    CREATE INDEX IF NOT EXISTS "page_visits_sessionId_idx" ON "page_visits"("sessionId");
    CREATE INDEX IF NOT EXISTS "page_visits_path_idx" ON "page_visits"("path");
    CREATE INDEX IF NOT EXISTS "page_visits_createdAt_idx" ON "page_visits"("createdAt");
    
    CREATE INDEX IF NOT EXISTS "product_interactions_sessionId_idx" ON "product_interactions"("sessionId");
    CREATE INDEX IF NOT EXISTS "product_interactions_productId_idx" ON "product_interactions"("productId");
    CREATE INDEX IF NOT EXISTS "product_interactions_type_idx" ON "product_interactions"("type");
    CREATE INDEX IF NOT EXISTS "product_interactions_createdAt_idx" ON "product_interactions"("createdAt");
    
    CREATE INDEX IF NOT EXISTS "search_queries_sessionId_idx" ON "search_queries"("sessionId");
    CREATE INDEX IF NOT EXISTS "search_queries_query_idx" ON "search_queries"("query");
    CREATE INDEX IF NOT EXISTS "search_queries_createdAt_idx" ON "search_queries"("createdAt");

    ALTER TABLE "tracking_sessions" DROP CONSTRAINT IF EXISTS "tracking_sessions_userId_fkey";
    ALTER TABLE "tracking_sessions" ADD CONSTRAINT "tracking_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

    ALTER TABLE "page_visits" DROP CONSTRAINT IF EXISTS "page_visits_sessionId_fkey";
    ALTER TABLE "page_visits" ADD CONSTRAINT "page_visits_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "tracking_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

    ALTER TABLE "product_interactions" DROP CONSTRAINT IF EXISTS "product_interactions_sessionId_fkey";
    ALTER TABLE "product_interactions" ADD CONSTRAINT "product_interactions_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "tracking_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

    ALTER TABLE "product_interactions" DROP CONSTRAINT IF EXISTS "product_interactions_productId_fkey";
    ALTER TABLE "product_interactions" ADD CONSTRAINT "product_interactions_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

    ALTER TABLE "product_interactions" DROP CONSTRAINT IF EXISTS "product_interactions_userId_fkey";
    ALTER TABLE "product_interactions" ADD CONSTRAINT "product_interactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

    ALTER TABLE "search_queries" DROP CONSTRAINT IF EXISTS "search_queries_sessionId_fkey";
    ALTER TABLE "search_queries" ADD CONSTRAINT "search_queries_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "tracking_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

    ALTER TABLE "search_queries" DROP CONSTRAINT IF EXISTS "search_queries_userId_fkey";
    ALTER TABLE "search_queries" ADD CONSTRAINT "search_queries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  `;

  try {
    await client.query(query);
    console.log("Analytics tables created successfully in Supabase!");
  } catch(e) {
    console.error("Error creating tables: ", e);
  } finally {
    await client.end();
  }
}

run();
