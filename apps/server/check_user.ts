import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

async function main() {
  const email = 'sahannawarathne2004@gmail.com';
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    console.log('User found:', user.email, 'Role:', user.role);
    console.log('Password hash:', user.password);
  } else {
    console.log('User NOT found:', email);
    const users = await prisma.user.findMany({ select: { email: true } });
    console.log('All users in DB:', users.map(u => u.email));
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
