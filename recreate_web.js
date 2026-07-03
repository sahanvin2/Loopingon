const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Recreating web container...');
    const res = await ssh.execCommand('cd /opt/loopingon && docker compose -f docker/docker-compose.prod.yml up -d web');
    console.log("STDOUT:", res.stdout);
    
    // Also restart nginx just in case upstream changes
    await ssh.execCommand('cd /opt/loopingon && docker compose -f docker/docker-compose.prod.yml restart nginx');

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
