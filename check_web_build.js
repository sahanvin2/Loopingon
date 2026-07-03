const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Checking client build files for Supabase URL...');
    const res = await ssh.execCommand('docker exec loopingon-web-prod grep -r "lbrggticuwyqmdtllxsh.supabase.co" /app/apps/web/.next/static/');
    console.log("STDOUT:", res.stdout);

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
