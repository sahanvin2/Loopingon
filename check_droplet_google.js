const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    const result = await ssh.execCommand('grep -r "signInWithOAuth" /opt/loopingon/apps/web/src');
    console.log("GREP RESULT:", result.stdout || result.stderr);
    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
