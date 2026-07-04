const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    // Pull latest code
    console.log('Pulling latest code...');
    const pullRes = await ssh.execCommand('git fetch --all && git reset --hard origin/main', { cwd: '/opt/loopingon' });
    console.log(pullRes.stdout || pullRes.stderr);

    // Add FRONTEND_URL to docker .env if not present
    console.log('Checking env vars on droplet...');
    const checkEnv = await ssh.execCommand('grep -c "FRONTEND_URL" /opt/loopingon/docker/.env || echo "0"', { cwd: '/opt/loopingon' });
    if (checkEnv.stdout.trim() === '0') {
      console.log('Adding FRONTEND_URL to docker/.env...');
      await ssh.execCommand('echo "FRONTEND_URL=https://kandyam.com" >> /opt/loopingon/docker/.env');
    }
    
    // Also check the root .env
    const checkRootEnv = await ssh.execCommand('grep -c "FRONTEND_URL" /opt/loopingon/.env || echo "0"', { cwd: '/opt/loopingon' });
    if (checkRootEnv.stdout.trim() === '0') {
      console.log('Adding FRONTEND_URL to .env...');
      await ssh.execCommand('echo "FRONTEND_URL=https://kandyam.com" >> /opt/loopingon/.env');
    }

    // Build server
    console.log('Building server...');
    const buildServer = await ssh.execCommand('docker build -t registry.digitalocean.com/loopingon/server:latest -f apps/server/Dockerfile .', { cwd: '/opt/loopingon' });
    console.log('Server build done.');
    if (buildServer.stderr && buildServer.stderr.includes('ERROR')) console.error(buildServer.stderr);

    // Build web
    console.log('Building web...');
    const buildWeb = await ssh.execCommand('docker build -t registry.digitalocean.com/loopingon/web:latest -f apps/web/Dockerfile .', { cwd: '/opt/loopingon' });
    console.log('Web build done.');
    if (buildWeb.stderr && buildWeb.stderr.includes('ERROR')) console.error(buildWeb.stderr);

    // Restart all services
    console.log('Restarting services...');
    const upRes = await ssh.execCommand('docker compose -f docker/docker-compose.prod.yml up -d server worker web', { cwd: '/opt/loopingon' });
    console.log(upRes.stdout);
    if (upRes.stderr) console.log(upRes.stderr);

    // Restart nginx
    console.log('Restarting nginx...');
    await ssh.execCommand('docker restart loopingon-nginx-prod');
    
    console.log('All done!');
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
run();
