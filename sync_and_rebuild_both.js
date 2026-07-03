const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Copying server files...');
    await ssh.putFile('apps/server/src/services/auth.service.ts', '/opt/loopingon/apps/server/src/services/auth.service.ts');
    await ssh.putFile('apps/server/src/routes/auth.routes.ts', '/opt/loopingon/apps/server/src/routes/auth.routes.ts');
    await ssh.putFile('apps/server/src/services/product.service.ts', '/opt/loopingon/apps/server/src/services/product.service.ts');
    await ssh.putFile('apps/server/Dockerfile', '/opt/loopingon/apps/server/Dockerfile');
    await ssh.putFile('apps/server/prisma/schema.prisma', '/opt/loopingon/apps/server/prisma/schema.prisma');
    
    console.log('Copying configuration files...');
    await ssh.putFile('.env', '/opt/loopingon/.env');
    await ssh.putFile('docker/docker-compose.prod.yml', '/opt/loopingon/docker/docker-compose.prod.yml');

    console.log('Copying web files...');
    await ssh.putFile('apps/web/src/app/auth/callback/route.ts', '/opt/loopingon/apps/web/src/app/auth/callback/route.ts');
    await ssh.putFile('apps/web/src/components/home/discovery-row.tsx', '/opt/loopingon/apps/web/src/components/home/discovery-row.tsx');

    console.log('Building server image...');
    const serverBuild = await ssh.execCommand('docker build -t registry.digitalocean.com/loopingon/server:latest -f apps/server/Dockerfile .', { cwd: '/opt/loopingon' });
    console.log("SERVER BUILD:", serverBuild.stdout);

    console.log('Building web image...');
    const webBuild = await ssh.execCommand('docker build -t registry.digitalocean.com/loopingon/web:latest -f apps/web/Dockerfile .', { cwd: '/opt/loopingon' });
    console.log("WEB BUILD:", webBuild.stdout);

    console.log('Restarting containers...');
    const restart = await ssh.execCommand('docker compose -f docker-compose.prod.yml up -d server web', { cwd: '/opt/loopingon/docker' });
    console.log("RESTART:", restart.stdout);

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
