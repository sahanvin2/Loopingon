const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Restoring local DATABASE_URL...');
    const url = 'postgresql://loopingon:loopingon_secret@postgres:5432/loopingon';
    
    // Replace in /opt/loopingon/.env
    await ssh.execCommand(`sed -i 's|DATABASE_URL=.*|DATABASE_URL=${url}|g' /opt/loopingon/.env`);
    
    // Replace in /opt/loopingon/docker/.env
    await ssh.execCommand(`sed -i 's|DATABASE_URL=.*|DATABASE_URL=${url}|g' /opt/loopingon/docker/.env`);
    
    console.log('Recreating server container...');
    const res = await ssh.execCommand('cd /opt/loopingon && docker compose -f docker/docker-compose.prod.yml up -d server worker');
    console.log("STDOUT:", res.stdout);
    console.log("STDERR:", res.stderr);
    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
