const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Fetching server logs...');
    const result = await ssh.execCommand('docker logs loopingon-server-prod --tail 500', { cwd: '/opt/loopingon' });
    fs.writeFileSync('server_logs.txt', result.stdout || result.stderr);
    console.log('Logs saved to server_logs.txt');
    
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
run();
