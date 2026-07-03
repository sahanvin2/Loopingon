const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Testing Supabase pooler inside docker...');
    const script = `
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'], datasourceUrl: 'postgresql://postgres.lbrggticuwyqmdtllxsh:%4020040301Sahan@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1' });
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
    // We've already verified the droplet has network issues reaching the Supabase IP for both pooler and direct. 
    // Let's do a curl to google.com to ensure general outbound network works on the host
    const resGoogle = await ssh.execCommand('curl -s -o /dev/null -w "%{http_code}" https://google.com');
    console.log("Curl google.com HTTP Code:", resGoogle.stdout);
    
    // Now curl the supabase domain
    const resSupa = await ssh.execCommand('curl -s -o /dev/null -w "%{http_code}" https://db.lbrggticuwyqmdtllxsh.supabase.co');
    console.log("Curl db HTTP Code:", resSupa.stdout);
    
    const resPooler = await ssh.execCommand('curl -s -o /dev/null -w "%{http_code}" https://aws-0-ap-southeast-1.pooler.supabase.com');
    console.log("Curl pooler HTTP Code:", resPooler.stdout);

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
