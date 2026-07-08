const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    const res = await ssh.execCommand('cat /opt/loopingon/apps/server/prisma/schema.prisma');
    console.log(res.stdout);
    ssh.dispose();
  } catch (e) {
    console.error(e);
  }
}
run();
