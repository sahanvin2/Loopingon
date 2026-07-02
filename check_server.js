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
    console.log("--- UFW Status ---");
    const ufw = await ssh.execCommand('ufw status');
    console.log(ufw.stdout);

    console.log("\n--- Docker PS ---");
    const dockerPs = await ssh.execCommand('docker ps -a');
    console.log(dockerPs.stdout);
    
    console.log("\n--- Docker Compose Logs ---");
    const dockerLogs = await ssh.execCommand('docker compose -f docker/docker-compose.prod.yml logs --tail 20', { cwd: '/opt/loopingon' });
    console.log(dockerLogs.stdout || dockerLogs.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    if(ssh) ssh.dispose();
  }
}

run();
