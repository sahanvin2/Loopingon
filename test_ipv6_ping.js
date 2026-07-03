const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Testing IPv6 ping on droplet host...');
    const res = await ssh.execCommand('ping6 -c 3 db.lbrggticuwyqmdtllxsh.supabase.co');
    console.log("Ping STDOUT:", res.stdout);
    console.log("Ping STDERR:", res.stderr);

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
