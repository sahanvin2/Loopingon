const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Checking env vars...');
    const res = await ssh.execCommand('grep NEXT_PUBLIC_APP_URL /opt/loopingon/.env');
    console.log("STDOUT:", res.stdout);

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
