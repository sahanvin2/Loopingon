const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Checking nginx logs for callback...');
    const res = await ssh.execCommand('docker logs loopingon-nginx-prod 2>&1 | grep "callback" | tail -n 20');
    console.log("NGINX STDOUT:", res.stdout);

    const res2 = await ssh.execCommand('docker logs loopingon-nginx-prod 2>&1 | grep "502" | tail -n 20');
    console.log("NGINX 502:", res2.stdout);

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
