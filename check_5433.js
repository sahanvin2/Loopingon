const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Checking for processes on port 5433...');
    const res = await ssh.execCommand('netstat -tlpn | grep 5433 || echo "Not found"');
    console.log("Port 5433 STDOUT:", res.stdout);

    console.log('Checking dockerps...');
    const res2 = await ssh.execCommand('docker ps -a');
    console.log("Docker PS STDOUT:", res2.stdout);

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
