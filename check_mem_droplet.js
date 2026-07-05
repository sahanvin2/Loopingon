const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '159.65.227.217', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    const result = await ssh.execCommand('free -m');
    console.log("Memory:\n" + result.stdout);
    const result2 = await ssh.execCommand('df -h');
    console.log("Disk:\n" + result2.stdout);
    ssh.dispose();
  } catch(e) { console.error(e); }
}
run();
