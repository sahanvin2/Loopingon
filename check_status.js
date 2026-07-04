const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
  
  const ps = await ssh.execCommand('docker ps --format "{{.Names}}  {{.CreatedAt}}  {{.Status}}"', { cwd: '/opt/loopingon' });
  console.log(ps.stdout);
  process.exit(0);
}
run();
