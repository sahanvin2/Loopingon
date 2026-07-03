import { PrismaClient } from '@prisma/client';
import { googleAuth } from './src/services/auth.service';

const prisma = new PrismaClient();

async function run() {
  try {
    const profile = {
      id: "109926869337572385257",
      email: "snawarathne60@gmail.com",
      name: "Sahan nawarathne",
      picture: "https://lh3.googleusercontent.com/a/ACg8ocK8jYxhW7Efigb2qGjB2THibRyA3UZ9uU14EyXGBcLD0Lz_vw=s96-c"
    };
    console.log("Testing googleAuth...");
    const res = await googleAuth(profile);
    console.log("Success:", res.user.email);
  } catch (err) {
    console.error("Error in googleAuth:", err);
  } finally {
    await prisma.$disconnect();
  }
}
run();
