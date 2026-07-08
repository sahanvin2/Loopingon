const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    console.log("Connecting to Droplet...");
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Fetching nginx logs...');
    const nginxLogs = await ssh.execCommand('docker compose logs --tail 20 nginx', { cwd: '/opt/loopingon/docker' });
    console.log(nginxLogs.stdout);
    if(nginxLogs.stderr) console.error(nginxLogs.stderr);

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
run();
