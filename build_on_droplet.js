const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    console.log("Building Docker images on Droplet...");
    // Build Web
    let res = await ssh.execCommand('cd /opt/loopingon/apps/web && docker build -t registry.digitalocean.com/loopingon/web:latest .');
    console.log("Web Build:", res.stdout || res.stderr);
    
    // Restart Compose
    res = await ssh.execCommand('cd /opt/loopingon && docker compose -f docker/docker-compose.prod.yml up -d web');
    console.log("Compose Up:", res.stdout || res.stderr);
    
    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
