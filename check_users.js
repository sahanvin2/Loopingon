const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Querying users...');
    const cmd = `export $(cat /opt/loopingon/.env | grep DATABASE_URL) && docker exec loopingon-postgres-prod psql $DATABASE_URL -c "SELECT id, email FROM public.users LIMIT 5;"`;
    const res = await ssh.execCommand(cmd);
    console.log("PUBLIC.USERS:", res.stdout);

    const cmd2 = `export $(cat /opt/loopingon/.env | grep DATABASE_URL) && docker exec loopingon-postgres-prod psql $DATABASE_URL -c "SELECT id, email FROM auth.users LIMIT 5;"`;
    const res2 = await ssh.execCommand(cmd2);
    console.log("AUTH.USERS:", res2.stdout);

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
