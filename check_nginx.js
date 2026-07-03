const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Checking nginx logs...');
    const res = await ssh.execCommand('docker logs --tail 20 loopingon-nginx-prod');
    console.log("STDOUT:", res.stdout);
    console.log("STDERR:", res.stderr);

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
