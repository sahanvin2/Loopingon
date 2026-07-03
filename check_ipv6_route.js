const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Checking IPv6 routes...');
    const res = await ssh.execCommand('ip -6 route');
    console.log("IPv6 Routes STDOUT:", res.stdout);
    
    // Check if we can ping the gateway
    const gatewayMatch = res.stdout.match(/default via ([^\s]+)/);
    if (gatewayMatch) {
      const gw = gatewayMatch[1];
      console.log('Pinging gateway:', gw);
      const resPing = await ssh.execCommand(`ping6 -c 1 ${gw}`);
      console.log("Ping GW STDOUT:", resPing.stdout);
    }

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
