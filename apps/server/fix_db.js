const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    console.log("Fixing database schema...");
    
    await prisma.$executeRawUnsafe(`
DO $$ BEGIN
  CREATE TYPE "NotificationType" AS ENUM ('ORDER_UPDATE', 'PROMOTION', 'SYSTEM', 'PAYMENT', 'SECURITY');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
    `);

    await prisma.$executeRawUnsafe(`
DO $$ BEGIN
  CREATE TYPE "NotificationChannel" AS ENUM ('IN_APP', 'EMAIL', 'SMS', 'PUSH');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
    `);

    await prisma.$executeRawUnsafe(`
DO $$ BEGIN
  CREATE TYPE "CompetitionStatus" AS ENUM ('UPCOMING', 'ACTIVE', 'JUDGING', 'COMPLETED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
    `);

    console.log("Types created.");

    // Alter Notification table
    await prisma.$executeRawUnsafe(`
ALTER TABLE "notifications" 
  ALTER COLUMN "type" TYPE "NotificationType" USING type::text::"NotificationType",
  ALTER COLUMN "channel" TYPE "NotificationChannel" USING channel::text::"NotificationChannel";
    `);
    console.log("Altered notifications table.");

    // Alter Competition table
    await prisma.$executeRawUnsafe(`
ALTER TABLE "competitions" ALTER COLUMN "status" DROP DEFAULT;
    `);
    await prisma.$executeRawUnsafe(`
UPDATE "competitions" SET status = 'UPCOMING' WHERE status = 'DRAFT';
    `);
    await prisma.$executeRawUnsafe(`
ALTER TABLE "competitions" 
  ALTER COLUMN "status" TYPE "CompetitionStatus" USING 'UPCOMING'::"CompetitionStatus";
    `);
    await prisma.$executeRawUnsafe(`
ALTER TABLE "competitions" ALTER COLUMN "status" SET DEFAULT 'UPCOMING'::"CompetitionStatus";
    `);
    console.log("Altered competitions table.");

    // Alter AuditLog table
    await prisma.$executeRawUnsafe(`
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
    await prisma.$disconnect();
  }
}

run();
