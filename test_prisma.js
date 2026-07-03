const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    // Create script on droplet
    await ssh.execCommand(`cat << 'EOF' > /opt/loopingon/apps/server/test_prisma.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  try {
    const user = await prisma.user.create({
      data: {
        email: "test-random123@gmail.com",
        fullName: "Test User",
        googleId: "1234567890",
        emailVerified: true,
        role: "CUSTOMER",
        avatar: "https://example.com/avatar.png",
        customerProfile: { create: {} },
      },
    });
    console.log("Created user:", user.id);
    
    // Clean up
    await prisma.user.delete({ where: { id: user.id } });
  } catch (err: any) {
    console.error("Prisma Error:", err);
    if (err.code) console.error("Code:", err.code);
    if (err.meta) console.error("Meta:", JSON.stringify(err.meta));
  } finally {
    await prisma.$disconnect();
  }
}
run();
EOF`);

    // We can't use ts-node because of module resolution in the compiled container.
    // Let's compile it and then run it!
    const res = await ssh.execCommand('docker exec loopingon-server-prod npx tsc test_prisma.ts --esModuleInterop', { cwd: '/opt/loopingon/apps/server' });
    const runRes = await ssh.execCommand('docker exec loopingon-server-prod node test_prisma.js', { cwd: '/opt/loopingon/apps/server' });
    console.log("RUN STDOUT:", runRes.stdout);
    console.log("RUN STDERR:", runRes.stderr);

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
