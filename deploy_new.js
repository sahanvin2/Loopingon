const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    console.log('Connecting to droplet...');
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Creating new folder and cloning...');
    const clone = await ssh.execCommand('git clone https://github.com/sahanvin2/Loopingon.git /opt/loopingon-digital || (cd /opt/loopingon-digital && git pull)');
    console.log(clone.stdout);
    if(clone.stderr) console.error(clone.stderr);

    console.log('Uploading .env files...');
    await ssh.putFile('apps/server/.env', '/opt/loopingon-digital/apps/server/.env');
    await ssh.putFile('apps/web/.env', '/opt/loopingon-digital/apps/web/.env');

    console.log('Stopping old containers...');
    await ssh.execCommand('cd /opt/loopingon && docker compose down');

    console.log('Building and starting new containers...');
    const build = await ssh.execCommand('docker compose -f docker/docker-compose.prod.yml up -d --build', { cwd: '/opt/loopingon-digital' });
    console.log(build.stdout);
    if(build.stderr) console.error(build.stderr);

    console.log('Deployment successful!');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
run();
