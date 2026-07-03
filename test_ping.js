const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Testing IPv4 ping...');
    const resPing = await ssh.execCommand('ping -4 -c 1 db.lbrggticuwyqmdtllxsh.supabase.co');
    console.log("IPv4 Ping STDOUT:", resPing.stdout);
    console.log("IPv4 Ping STDERR:", resPing.stderr);

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
