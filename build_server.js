const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    console.log('Resetting git...');
    await ssh.execCommand('git fetch --all && git reset --hard origin/main', { cwd: '/opt/loopingon' });
    
    console.log('Building server...');
    const buildRes = await ssh.execCommand('docker build -t registry.digitalocean.com/loopingon/server:latest -f apps/server/Dockerfile .', { cwd: '/opt/loopingon' });
    console.log(buildRes.stdout);
    if (buildRes.stderr) console.error(buildRes.stderr);
    
    console.log('Starting server and worker...');
    const upRes = await ssh.execCommand('docker compose -f docker/docker-compose.prod.yml up -d server worker', { cwd: '/opt/loopingon' });
    console.log(upRes.stdout);
    if (upRes.stderr) console.error(upRes.stderr);
    
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
run();
