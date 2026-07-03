const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Copying test_google.ts to server container and running it...');
    // We can just run it using npx tsx test_google.ts on the droplet's source code,
    // wait, the droplet's source code is at /opt/loopingon/apps/server
    // Let's create the file directly on the droplet:
    await ssh.execCommand(`cat << 'EOF' > /opt/loopingon/apps/server/test_google.ts
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
EOF`);

    // Run it using docker exec
    const res = await ssh.execCommand('docker exec loopingon-server-prod npx ts-node test_google.ts', { cwd: '/opt/loopingon/apps/server' });
    console.log("STDOUT:", res.stdout);
    console.log("STDERR:", res.stderr);

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
