const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Checking for web Dockerfile...');
    const res = await ssh.execCommand('ls -la /opt/loopingon/apps/web/');
    console.log(res.stdout);

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
