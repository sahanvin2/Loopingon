const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Installing socat...');
    const res1 = await ssh.execCommand('apt-get update && apt-get install -y socat');
    console.log("Install STDOUT:", res1.stdout);

    console.log('Starting socat proxy...');
    // Run socat in background: listen on IPv4 port 5433, forward to IPv6 Supabase port 5432
    // We bind it to 172.17.0.1 so only local Docker containers can access it
    const res2 = await ssh.execCommand('nohup socat TCP4-LISTEN:5433,bind=172.17.0.1,reuseaddr,fork TCP6:2406:da18:e5c:b702:39b0:45b4:b70a:542e:5432 > /var/log/socat-postgres.log 2>&1 &');
    
    console.log("Socat STDOUT:", res2.stdout);
    
    // Check if it's listening
    const res3 = await ssh.execCommand('sleep 2 && netstat -tlpn | grep 5433');
    console.log("Netstat STDOUT:", res3.stdout);

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
