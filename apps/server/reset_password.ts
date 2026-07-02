import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const email = 'sahannawarathne2004@gmail.com';
  const newPassword = '@20040301';
  
  const passwordHash = await argon2.hash(newPassword);
  
  const user = await prisma.user.update({
    where: { email },
    data: { 
      passwordHash,
      failedLoginAttempts: 0,
      lockedUntil: null
    }
  });

  console.log(`Password reset for ${user.email} (Role: ${user.role})`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
