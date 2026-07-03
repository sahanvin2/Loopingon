const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    const result = await ssh.execCommand('cd /opt/loopingon && docker compose -f docker/docker-compose.prod.yml logs --tail 50 nginx');
    console.log(result.stdout || result.stderr);
    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
