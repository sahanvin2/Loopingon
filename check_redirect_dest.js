const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Checking nginx logs around 20:53:54...');
    const res = await ssh.execCommand('docker logs loopingon-nginx-prod 2>&1 | grep -A 5 "code=eb5552bc-6b2f-4094-a895-d00aafd6e754"');
    console.log("NGINX LOGS:", res.stdout);

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
