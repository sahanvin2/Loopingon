const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    const result = await ssh.execCommand('docker start loopingon-nginx-prod');
    console.log("START NGINX:", result.stdout || result.stderr);
    
    await new Promise(r => setTimeout(r, 2000));
    const ps = await ssh.execCommand('docker ps -a | grep nginx');
    console.log("PS:", ps.stdout || ps.stderr);
    
    const logs = await ssh.execCommand('docker logs loopingon-nginx-prod --tail 20');
    console.log("LOGS:", logs.stdout || logs.stderr);
    
    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
