const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Checking web and server logs...');
    const web = await ssh.execCommand('docker logs loopingon-web-prod --tail 20');
    console.log("WEB LOGS:", web.stdout, web.stderr);

    const server = await ssh.execCommand('docker logs loopingon-server-prod --tail 20');
    console.log("SERVER LOGS:", server.stdout, server.stderr);

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
