const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    console.log('Connecting...');
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Restarting containers...');
    const res = await ssh.execCommand('docker compose up -d nginx web', { cwd: '/opt/loopingon/docker' });
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
