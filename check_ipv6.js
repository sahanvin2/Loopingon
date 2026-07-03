const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Checking DigitalOcean metadata for IPv6...');
    const res = await ssh.execCommand('curl -s http://169.254.169.254/metadata/v1/interfaces/public/0/ipv6/address || echo "No IPv6"');
    console.log("IPv6 Address:", res.stdout);
    
    const res2 = await ssh.execCommand('ip -6 addr show');
    console.log("IP -6 Addr:", res2.stdout);

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
