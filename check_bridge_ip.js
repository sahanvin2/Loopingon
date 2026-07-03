const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Checking docker0 IP...');
    const res = await ssh.execCommand('ip -4 addr show docker0');
    console.log("STDOUT:", res.stdout);

    console.log('Checking br-b777ead2f61b IP...');
    const res2 = await ssh.execCommand('ip -4 addr show br-b777ead2f61b');
    console.log("STDOUT:", res2.stdout);

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
