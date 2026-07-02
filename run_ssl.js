const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '165.227.90.181',
      username: 'root',
      password: '@20040301Sa',
      tryKeyboard: true,
    });
    
    console.log("Stopping Nginx container to free port 80...");
    await ssh.execCommand('docker stop loopingon-nginx-prod || true', { cwd: '/opt/loopingon' });
    
    console.log("Running certbot...");
    const certbot = await ssh.execCommand('certbot certonly --standalone -d kandyam.com -d www.kandyam.com -m snawarathne10@gmail.com --agree-tos --non-interactive', { cwd: '/opt/loopingon' });
    console.log(certbot.stdout || certbot.stderr);

    console.log("Copying certificates...");
    await ssh.execCommand('cp /etc/letsencrypt/live/kandyam.com/fullchain.pem docker/nginx/ssl/server.crt', { cwd: '/opt/loopingon' });
    await ssh.execCommand('cp /etc/letsencrypt/live/kandyam.com/privkey.pem docker/nginx/ssl/server.key', { cwd: '/opt/loopingon' });
    await ssh.execCommand('chmod 644 docker/nginx/ssl/server.crt', { cwd: '/opt/loopingon' });
    await ssh.execCommand('chmod 644 docker/nginx/ssl/server.key', { cwd: '/opt/loopingon' });

    console.log("Restarting Nginx...");
    const restart = await ssh.execCommand('docker compose -f docker/docker-compose.build.yml up -d nginx', { cwd: '/opt/loopingon' });
    console.log(restart.stdout || restart.stderr);

    console.log("Done!");
    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    if(ssh) ssh.dispose();
  }
}

run();
