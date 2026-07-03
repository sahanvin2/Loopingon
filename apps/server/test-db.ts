import { PrismaClient } from '@prisma/client'; 
const prisma = new PrismaClient(); 

async function main() { 
  try { 
    await prisma.user.create({ 
      data: { 
        id: '772c7546-5b43-4cc0-8456-9a2c3dbf9b77', 
        email: 'testfk@test.com', 
        fullName: 'Test FK', 
        role: 'CUSTOMER' 
      } 
    }); 
    console.log('SUCCESS'); 
  } catch (e: any) { 
    console.error('ERROR:', e.code, e.meta); 
  } finally { 
    await prisma.$disconnect(); 
  } 
} 
main();
