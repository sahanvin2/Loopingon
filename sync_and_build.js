const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Syncing files to droplet...');
    const localRoute = fs.readFileSync('d:/Mern/Loopingon/loopingon/apps/web/src/app/auth/callback/route.ts', 'utf8');
    const localProvider = fs.readFileSync('d:/Mern/Loopingon/loopingon/apps/web/src/providers/auth-provider.tsx', 'utf8');

    await ssh.execCommand(`cat << 'EOF' > /opt/loopingon/apps/web/src/app/auth/callback/route.ts\n${localRoute}\nEOF\n`);
    await ssh.execCommand(`cat << 'EOF' > /opt/loopingon/apps/web/src/providers/auth-provider.tsx\n${localProvider}\nEOF\n`);

    console.log('Building web container on droplet...');
    const res = await ssh.execCommand('docker compose -f docker-compose.prod.yml up -d --build web', { cwd: '/opt/loopingon/docker' });
    console.log(res.stdout);
    console.log(res.stderr);

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
