const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    const res = await ssh.execCommand('ls -la /');
    const res2 = await ssh.execCommand('ls -la /root');
    console.log("ROOT DIR:", res.stdout);
    console.log("/root DIR:", res2.stdout);
    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
