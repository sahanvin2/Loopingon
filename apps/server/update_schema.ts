import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`ALTER TABLE "public"."audit_logs" ADD COLUMN IF NOT EXISTS "device" TEXT;`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "public"."audit_logs" ADD COLUMN IF NOT EXISTS "country" TEXT;`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "public"."audit_logs" ADD COLUMN IF NOT EXISTS "city" TEXT;`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "public"."vendors" ALTER COLUMN "commissionRate" SET DEFAULT 10.0;`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "public"."orders" ALTER COLUMN "commissionRate" SET DEFAULT 10.0;`);
  console.log("Database schema updated manually.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
