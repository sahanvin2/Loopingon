const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Testing Supabase direct connection inside docker (Original IPv6 string)...');
    const script = `
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'], datasourceUrl: 'postgresql://postgres:%4020040301Sahan@db.lbrggticuwyqmdtllxsh.supabase.co:5432/postgres' });
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
    const fs = require('fs');
    fs.writeFileSync('test_prisma.js', script);
    await ssh.putFile('test_prisma.js', '/tmp/test_prisma.js');
    
    const res = await ssh.execCommand('docker cp /tmp/test_prisma.js loopingon-server-prod:/app/test_prisma.js && docker exec loopingon-server-prod node /app/test_prisma.js');
    console.log("STDOUT:", res.stdout);
    console.log("STDERR:", res.stderr);
    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
