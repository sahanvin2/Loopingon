const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    console.log('Connecting...');
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Fetching logs...');
    const res = await ssh.execCommand('docker logs --tail 200 loopingon-server | grep Error -A 10 -B 5');
    console.log(res.stdout);
    if(res.stderr) console.error(res.stderr);

    console.log('Done!');
    ssh.dispose();
  } catch (e) {
    console.error(e);
    if(ssh) ssh.dispose();
  }
}
run();
