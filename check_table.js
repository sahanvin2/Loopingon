const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    // We can extract DATABASE_URL and run psql \d public.users
    const cmd = `export $(cat /opt/loopingon/.env | grep DATABASE_URL) && docker exec loopingon-postgres-prod psql $DATABASE_URL -c "\\d public.users"`;
    const res = await ssh.execCommand(cmd);
    console.log(res.stdout);
    console.log(res.stderr);

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
