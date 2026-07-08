const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    console.log('Connecting...');
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Building server image without cache...');
    const res = await ssh.execCommand('docker compose build --no-cache server', { cwd: '/opt/loopingon/docker' });
    console.log(res.stdout);
    if(res.stderr) console.error(res.stderr);

    console.log('Recreating container...');
    const res2 = await ssh.execCommand('docker compose up -d --force-recreate server', { cwd: '/opt/loopingon/docker' });
    console.log(res2.stdout);
    if(res2.stderr) console.error(res2.stderr);

    console.log('Done!');
    ssh.dispose();
  } catch (e) {
    console.error(e);
    if(ssh) ssh.dispose();
  }
}
run();
