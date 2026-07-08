const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
  const res = await ssh.execCommand('docker inspect --format="{{json .State.Health}}" loopingon-web');
  console.log('WEB:', res.stdout);
  
  const res2 = await ssh.execCommand('docker inspect --format="{{json .State.Health}}" loopingon-worker');
  console.log('WORKER:', res2.stdout);
  
  setTimeout(() => process.exit(0), 1000);
}
run().catch(console.error);
