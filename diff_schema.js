const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    // Write a sh script on the server to run diff
    const scriptStr = `
#!/bin/bash
cd /opt/loopingon/apps/server
npx dotenv -e /opt/loopingon/.env -- npx prisma migrate diff --from-url "$DATABASE_URL" --to-schema-datamodel prisma/schema.prisma --script
`;
    await ssh.execCommand(`echo '${scriptStr}' > /root/diff.sh && chmod +x /root/diff.sh`);
    
    const ps = await ssh.execCommand('/root/diff.sh');
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
