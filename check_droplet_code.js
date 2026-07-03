const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    const result = await ssh.execCommand('cat /opt/loopingon/apps/web/src/components/shared/auth-modal.tsx | grep redirectTo');
    console.log("AUTH MODAL:", result.stdout || result.stderr);
    
    const result2 = await ssh.execCommand('cat /opt/loopingon/apps/web/src/app/\\(auth\\)/sign-up/customer/page.tsx | grep redirectTo');
    console.log("CUSTOMER PAGE:", result2.stdout || result2.stderr);
    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
