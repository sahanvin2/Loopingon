const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Checking web logs for OAuth Error...');
    const res = await ssh.execCommand('docker logs loopingon-web-prod 2>&1 | grep "OAuth Code Exchange Error" | tail -n 20');
    console.log("STDOUT:", res.stdout);

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
