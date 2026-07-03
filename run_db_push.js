const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    console.log("Pushing DB schema...");
    const res = await ssh.execCommand('docker exec loopingon-server-prod npx prisma db push --accept-data-loss');
    console.log(res.stdout || res.stderr);
    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
