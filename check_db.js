const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    const res = await ssh.execCommand('docker exec loopingon-postgres-prod psql -U postgres -d kandyam -c "SELECT count(*) FROM \\"Product\\";"');
    console.log(res.stdout || res.stderr);
    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
