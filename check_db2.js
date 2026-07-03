const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    const res = await ssh.execCommand('cd /opt/loopingon && cat .env | grep POSTGRES_');
    console.log(res.stdout);
    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
