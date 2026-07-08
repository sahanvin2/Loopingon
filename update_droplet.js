const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    console.log('Connecting...');
    await ssh.connect({ 
        host: '165.227.90.181', 
        username: 'root', 
        password: '@20040301Sa', 
        tryKeyboard: true,
        keepaliveInterval: 10000 
    });
    
    console.log('Running deploy command...');
    const command = 'cd /opt/loopingon && git stash && git pull origin main && cd docker && docker compose up -d --build web';
    const res = await ssh.execCommand(command);
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
