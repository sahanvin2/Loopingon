const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Checking container file...');
    const res = await ssh.execCommand('docker exec loopingon-web-prod cat /app/apps/web/src/app/auth/callback/route.ts');
    console.log("ROUTE.TS:", res.stdout);

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
