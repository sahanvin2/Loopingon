const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    console.log("Connecting to Droplet...");
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Fetching server logs...');
    const serverLogs = await ssh.execCommand('docker compose logs --tail 200 server', { cwd: '/opt/loopingon/docker' });
    console.log(serverLogs.stdout);

    console.log('Fetching worker logs...');
    const workerLogs = await ssh.execCommand('docker compose logs --tail 200 worker', { cwd: '/opt/loopingon/docker' });
    console.log(workerLogs.stdout);

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
run();
