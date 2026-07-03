const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    // We can write a JS script directly that runs using Node
    await ssh.execCommand(`cat << 'EOF' > /opt/loopingon/apps/server/test_google.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function googleAuth(profile) {
  let user = await prisma.user.findUnique({ where: { googleId: profile.id } });
  if (!user) {
    user = await prisma.user.findUnique({ where: { email: profile.email } });
    if (user) {
      console.log("Found existing user by email:", user.id);
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId: profile.id, emailVerified: true, avatar: user.avatar || profile.picture },
      });
      console.log("Updated user!");
    } else {
      console.log("Creating new user...");
      user = await prisma.user.create({
        data: {
          email: profile.email,
          fullName: profile.name,
          googleId: profile.id,
          emailVerified: true,
          role: "CUSTOMER",
          avatar: profile.picture,
          customerProfile: { create: {} },
        },
      });
    }
  }

  console.log("Creating refresh token...");
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: "test-token",
      family: "test-family",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });
  console.log("Done!");
}

async function run() {
  try {
    const profile = {
      id: "109926869337572385257",
      email: "snawarathne60@gmail.com",
      name: "Sahan nawarathne",
      picture: "https://lh3.googleusercontent.com/a/ACg8ocK8jYxhW7Efigb2qGjB2THibRyA3UZ9uU14EyXGBcLD0Lz_vw=s96-c"
    };
    await googleAuth(profile);
  } catch (err) {
    console.error("Error in googleAuth:", err);
  } finally {
    await prisma.$disconnect();
  }
}
run();
EOF`);

    // Run it using docker exec
    const res = await ssh.execCommand('docker exec loopingon-server-prod node test_google.js', { cwd: '/opt/loopingon/apps/server' });
    console.log("STDOUT:", res.stdout);
    console.log("STDERR:", res.stderr);

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
