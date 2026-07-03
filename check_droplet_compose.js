const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Checking droplet docker-compose...');
    const res = await ssh.execCommand('grep DATABASE_URL /opt/loopingon/docker/docker-compose.prod.yml || echo "Not found"');
    console.log("STDOUT:", res.stdout);
    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
