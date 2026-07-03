const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    console.log("Fixing .env...");
    await ssh.execCommand('cp /opt/loopingon/.env /opt/loopingon/docker/.env');
    const res = await ssh.execCommand('cd /opt/loopingon && docker compose -f docker/docker-compose.prod.yml up -d server web worker');
    console.log(res.stdout || res.stderr);
    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
