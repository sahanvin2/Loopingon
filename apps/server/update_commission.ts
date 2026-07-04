import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.vendor.updateMany({
    where: {
      commissionRate: 20
    },
    data: {
      commissionRate: 10
    }
  });
  console.log(`Updated ${result.count} vendors to 10% commission rate.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
