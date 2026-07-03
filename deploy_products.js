const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Copying updated files...');
    await ssh.putFile('apps/web/src/app/(admin)/admin/products/page.tsx', '/opt/loopingon/apps/web/src/app/(admin)/admin/products/page.tsx');
    await ssh.putFile('apps/web/src/components/forms/rich-editor.tsx', '/opt/loopingon/apps/web/src/components/forms/rich-editor.tsx');

    console.log('Building web image...');
    const webBuild = await ssh.execCommand('docker build -t registry.digitalocean.com/loopingon/web:latest -f apps/web/Dockerfile .', { cwd: '/opt/loopingon' });
    console.log("WEB BUILD SUCCESS");
    
    console.log('Restarting web container...');
    const restart = await ssh.execCommand('docker compose -f docker-compose.prod.yml up -d web', { cwd: '/opt/loopingon/docker' });
    console.log("RESTART:", restart.stdout);

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
