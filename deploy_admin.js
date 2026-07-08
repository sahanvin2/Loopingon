const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    const file = 'apps/server/src/services/admin.service.ts';
    console.log(`Uploading ${file}...`);
    await ssh.putFile(file, `/opt/loopingon/${file}`);

    console.log('Building server image...');
    const build = await ssh.execCommand('docker build -t registry.digitalocean.com/loopingon/server:latest -f apps/server/Dockerfile .', { cwd: '/opt/loopingon' });
    if(build.stderr) console.error(build.stderr);
    console.log('SERVER BUILD SUCCESS');

    console.log('Restarting server container...');
    await ssh.execCommand('docker compose up -d server', { cwd: '/opt/loopingon/docker' });

    console.log('Done!');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
run();
