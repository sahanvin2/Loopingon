const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    // Write a sh script on the server to run db push
    const scriptStr = `
#!/bin/bash
cd /opt/loopingon/apps/server
npm install -g dotenv-cli
dotenv -e /opt/loopingon/.env -- npx prisma db push --accept-data-loss
`;
    await ssh.execCommand(`echo '${scriptStr}' > /root/db_push.sh && chmod +x /root/db_push.sh`);
    
    const ps = await ssh.execCommand('/root/db_push.sh');
    console.log(ps.stdout);
    if(ps.stderr) console.log('ERR:', ps.stderr);

    ssh.dispose();
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
run();
