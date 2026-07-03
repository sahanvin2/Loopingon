const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    console.log("Pulling and rebuilding web...");
    const res = await ssh.execCommand('cd /opt/loopingon && git pull origin main && docker build -t registry.digitalocean.com/loopingon/web:latest . -f apps/web/Dockerfile && docker compose -f docker/docker-compose.prod.yml up -d web');
    console.log(res.stdout || res.stderr);
    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
