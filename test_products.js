const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    const res = await ssh.execCommand('curl -s http://127.0.0.1:4000/api/v1/products?limit=1');
    console.log(res.stdout);
    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
