const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    // Create script on droplet
    await ssh.execCommand(`cat << 'EOF' > /opt/loopingon/apps/server/test_prisma_fast.js
async function run() {
  const { prisma } = require('./dist/config/database.js');
  try {
    const user = await prisma.user.create({
      data: {
        email: "test-fast123@gmail.com",
        fullName: "Test Fast User",
        googleId: "999888777",
        emailVerified: true,
        role: "CUSTOMER",
        avatar: "https://example.com/avatar.png",
        customerProfile: { create: {} },
      },
    });
    console.log("Created user:", user.id);
    
    // Clean up
    await prisma.user.delete({ where: { id: user.id } });
  } catch (err) {
    console.error("Prisma Error:", err);
    if (err.code) console.error("Code:", err.code);
    if (err.meta) console.error("Meta:", JSON.stringify(err.meta));
  } finally {
    await prisma.$disconnect();
  }
}
run();
EOF`);

    // Run it inside container mapping the volume, OR since we don't have the volume mapped for /opt/loopingon,
    // let's run it by piping it to docker exec!
    const res = await ssh.execCommand('docker exec -i loopingon-server-prod node -e "$(cat /opt/loopingon/apps/server/test_prisma_fast.js)"');
    console.log("STDOUT:", res.stdout);
    console.log("STDERR:", res.stderr);

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
