const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Testing Supabase pg inside docker...');
    const script = `
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });
async function test() {
  try {
    const count = await prisma.product.count();
    console.log('Products:', count);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}
test();
`;
    const res = await ssh.execCommand(`docker exec loopingon-server-prod sh -c "echo '${script.replace(/\n/g, '\\n')}' > /tmp/test_prisma.js && node /tmp/test_prisma.js"`);
    console.log("STDOUT:", res.stdout);
    console.log("STDERR:", res.stderr);
    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
