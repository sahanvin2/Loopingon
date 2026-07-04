const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function run() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Fixing database schema with pg...");
    
    await client.query(`
DO $$ BEGIN
  CREATE TYPE "NotificationType" AS ENUM ('ORDER_UPDATE', 'PROMOTION', 'SYSTEM', 'PAYMENT', 'SECURITY');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
    `);

    await client.query(`
DO $$ BEGIN
  CREATE TYPE "NotificationChannel" AS ENUM ('IN_APP', 'EMAIL', 'SMS', 'PUSH');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
    `);

    await client.query(`
DO $$ BEGIN
  CREATE TYPE "CompetitionStatus" AS ENUM ('UPCOMING', 'ACTIVE', 'JUDGING', 'COMPLETED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
    `);

    console.log("Types created.");

    // Alter Notification table
    await client.query(`
ALTER TABLE "notifications" 
  ALTER COLUMN "type" TYPE "NotificationType" USING type::text::"NotificationType",
  ALTER COLUMN "channel" TYPE "NotificationChannel" USING channel::text::"NotificationChannel";
    `);
    console.log("Altered notifications table.");

    // Alter Competition table
    await client.query(`
ALTER TABLE "competitions" ALTER COLUMN "status" DROP DEFAULT;
    `);
    await client.query(`
UPDATE "competitions" SET status = 'UPCOMING' WHERE status = 'DRAFT' OR status NOT IN ('UPCOMING', 'ACTIVE', 'JUDGING', 'COMPLETED', 'CANCELLED');
    `);
    await client.query(`
ALTER TABLE "competitions" 
  ALTER COLUMN "status" TYPE "CompetitionStatus" USING 'UPCOMING'::"CompetitionStatus";
    `);
    await client.query(`
ALTER TABLE "competitions" ALTER COLUMN "status" SET DEFAULT 'UPCOMING'::"CompetitionStatus";
    `);
    console.log("Altered competitions table.");

    // Alter AuditLog table
    await client.query(`
ALTER TABLE "audit_logs"
  ADD COLUMN IF NOT EXISTS "device" text,
  ADD COLUMN IF NOT EXISTS "country" text,
  ADD COLUMN IF NOT EXISTS "city" text;
    `);
    console.log("Altered audit_logs table.");

    console.log("Done fixing DB.");
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
