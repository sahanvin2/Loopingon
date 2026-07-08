const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    console.log("Connecting to Droplet...");
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Fetching web logs...');
    const webLogs = await ssh.execCommand('docker compose logs --tail 50 web', { cwd: '/opt/loopingon/docker' });
    console.log(webLogs.stdout);
    if(webLogs.stderr) console.error(webLogs.stderr);

    console.log('Fetching worker logs...');
    const workerLogs = await ssh.execCommand('docker compose logs --tail 50 worker', { cwd: '/opt/loopingon/docker' });
    console.log(workerLogs.stdout);

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
run();
