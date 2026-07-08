const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    console.log("Connecting to Droplet...");
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Fetching server logs...');
    const serverLogs = await ssh.execCommand('docker compose logs --tail 50 server', { cwd: '/opt/loopingon/docker' });
    console.log(serverLogs.stdout);
    if(serverLogs.stderr) console.error(serverLogs.stderr);

    console.log('Checking docker ps...');
    const ps = await ssh.execCommand('docker ps -a');
    console.log(ps.stdout);

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
run();
