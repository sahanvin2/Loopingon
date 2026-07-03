const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    // Check why nginx exited
    const result = await ssh.execCommand('cd /opt/loopingon && docker compose -f docker/docker-compose.prod.yml logs nginx');
    console.log("NGINX LOGS:");
    console.log(result.stdout || result.stderr);
    
    // Check if it exited with code 0 or error
    const ps = await ssh.execCommand('cd /opt/loopingon && docker compose -f docker/docker-compose.prod.yml ps -a');
    console.log("DOCKER PS:");
    console.log(ps.stdout || ps.stderr);

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
