const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    console.log('Connecting...');
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Fetching server logs...');
    const result = await ssh.execCommand('docker logs loopingon-server-prod --tail 500', { cwd: '/opt/loopingon' });
    fs.writeFileSync('server_logs.txt', result.stdout || result.stderr);
    console.log('Done!');
    setTimeout(() => {
        ssh.dispose();
        process.exit(0);
    }, 1000);
  } catch (e) {
    console.error(e);
    if(ssh) ssh.dispose();
  }
}
run();
