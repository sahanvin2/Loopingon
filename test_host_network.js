const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Testing network routing inside droplet...');
    const res = await ssh.execCommand('ping -c 1 db.lbrggticuwyqmdtllxsh.supabase.co');
    console.log("Ping db.lbrggticuwyqmdtllxsh.supabase.co STDOUT:", res.stdout);
    console.log("Ping db.lbrggticuwyqmdtllxsh.supabase.co STDERR:", res.stderr);

    const res2 = await ssh.execCommand('ping -c 1 aws-0-ap-southeast-1.pooler.supabase.com');
    console.log("Ping aws-0-ap-southeast-1.pooler.supabase.com STDOUT:", res2.stdout);
    console.log("Ping aws-0-ap-southeast-1.pooler.supabase.com STDERR:", res2.stderr);

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
