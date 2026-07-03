const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Checking droplet .env...');
    const res = await ssh.execCommand('cat /opt/loopingon/.env');
    console.log("STDOUT:", res.stdout);
    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
