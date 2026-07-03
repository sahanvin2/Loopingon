const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Checking nginx logs for callback redirects...');
    // Look for 307 or 302 or 303 redirects from /auth/callback
    const res = await ssh.execCommand('docker logs loopingon-nginx-prod 2>&1 | grep "GET /auth/callback" | tail -n 20');
    console.log("NGINX LOGS:", res.stdout);

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
