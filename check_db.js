const { PrismaClient } = require('./apps/server/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const count = await prisma.product.count({ where: { status: 'PUBLISHED' } });
  console.log(`Total published products: ${count}`);
  
  const related = await prisma.product.findMany({
    where: { status: 'PUBLISHED' },
    select: { id: true, title: true, vendorId: true, categories: { include: { category: true } } },
    take: 5
  });
  console.dir(related, { depth: null });
  process.exit(0);
}
run();
