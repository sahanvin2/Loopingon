const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Checking nginx logs for auth callback...');
    const res = await ssh.execCommand('docker logs loopingon-nginx-prod --tail 50 | grep "google"');
    console.log("NGINX LOGS:", res.stdout);

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
