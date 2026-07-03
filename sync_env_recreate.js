const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Copying .env to docker/.env...');
    await ssh.execCommand('cp /opt/loopingon/.env /opt/loopingon/docker/.env');
    
    console.log('Recreating web container...');
    const res = await ssh.execCommand('cd /opt/loopingon && docker compose -f docker/docker-compose.prod.yml up -d web');
    console.log("STDOUT:", res.stdout);
    
    // Also restart server to ensure it has the env vars if it needs them
    const res2 = await ssh.execCommand('cd /opt/loopingon && docker compose -f docker/docker-compose.prod.yml up -d server worker');
    console.log("STDOUT 2:", res2.stdout);
    
    await ssh.execCommand('cd /opt/loopingon && docker compose -f docker/docker-compose.prod.yml restart nginx');

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
