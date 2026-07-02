import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Connecting to database:', process.env.DATABASE_URL);
    await prisma.$connect();
    console.log('Successfully connected to Supabase Database!');
    // Try a simple query to ensure we can read
    const result = await prisma.$queryRaw`SELECT 1 as result`;
    console.log('Query test successful:', result);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
