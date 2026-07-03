const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Checking server side route.js for inlined env vars...');
    const res = await ssh.execCommand('docker exec loopingon-web-prod grep -r "NEXT_PUBLIC_APP_URL" /app/apps/web/.next/server/app/');
    console.log("STDOUT:", res.stdout);
    console.log("STDERR:", res.stderr);

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
