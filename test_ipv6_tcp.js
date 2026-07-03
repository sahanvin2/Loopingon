const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Testing IPv6 TCP port 5432...');
    const res = await ssh.execCommand('nc -z -v -w 5 2406:da18:e5c:b702:39b0:45b4:b70a:542e 5432');
    console.log("NC STDOUT:", res.stdout);
    console.log("NC STDERR:", res.stderr);

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
