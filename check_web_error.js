const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Checking web logs for fetch error...');
    const web = await ssh.execCommand('docker logs loopingon-web-prod --tail 100 | grep "Failed to sync"');
    console.log("WEB LOGS ERROR:", web.stdout, web.stderr);

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
