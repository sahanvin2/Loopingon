const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true }).then(async () => {
  const logs = await ssh.execCommand('docker logs loopingon-server-prod --tail 50');
  console.log('SERVER LOGS:', logs.stdout || logs.stderr);
  const inspect = await ssh.execCommand('docker inspect --format="{{json .State.Health}}" loopingon-server-prod');
  console.log('HEALTH:', inspect.stdout || inspect.stderr);
  ssh.dispose();
});
