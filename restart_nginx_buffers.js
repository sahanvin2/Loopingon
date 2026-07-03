const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
const fs = require('fs');

async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Uploading new nginx.conf...');
    await ssh.putFile('d:/Mern/Loopingon/loopingon/docker/nginx/nginx.conf', '/opt/loopingon/docker/nginx/nginx.conf');

    console.log('Restarting nginx...');
    const res = await ssh.execCommand('cd /opt/loopingon && docker compose -f docker/docker-compose.prod.yml restart nginx');
    console.log("STDOUT:", res.stdout);
    
    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
