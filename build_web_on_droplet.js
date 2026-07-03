const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Building web image on droplet...');
    // We need to build from /opt/loopingon context
    const res = await ssh.execCommand('docker build -t registry.digitalocean.com/loopingon/web:latest -f apps/web/Dockerfile .', { cwd: '/opt/loopingon' });
    console.log(res.stdout);
    console.log(res.stderr);

    console.log('Restarting web container...');
    const res2 = await ssh.execCommand('docker compose -f docker-compose.prod.yml up -d web', { cwd: '/opt/loopingon/docker' });
    console.log(res2.stdout);
    console.log(res2.stderr);

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
