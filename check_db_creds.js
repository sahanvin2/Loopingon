const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Checking .env for DB credentials...');
    const res = await ssh.execCommand('cat .env | grep POSTGRES_USER', { cwd: '/opt/loopingon' });
    console.log("USER:", res.stdout);
    const db = await ssh.execCommand('cat .env | grep POSTGRES_DB', { cwd: '/opt/loopingon' });
    console.log("DB:", db.stdout);

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
