const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Querying users table...');
    // Connect to postgres container
    const query = `SELECT id, email, "deletedAt", "googleId" FROM public.users WHERE email = 'snawarathne60@gmail.com';`;
    const res = await ssh.execCommand(`docker exec loopingon-postgres-prod psql -U postgres -d kandyam -c "${query}"`);
    console.log(res.stdout);
    console.log(res.stderr);

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
