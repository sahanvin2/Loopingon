const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Updating docker/.env...');
    const appendCmd = `echo "DATABASE_URL=postgresql://postgres:%4020040301Sahan@db.lbrggticuwyqmdtllxsh.supabase.co:5432/postgres" >> /opt/loopingon/docker/.env`;
    await ssh.execCommand(appendCmd);
    
    console.log('Recreating server container...');
    const res = await ssh.execCommand('cd /opt/loopingon && docker compose -f docker/docker-compose.prod.yml up -d server worker');
    console.log("STDOUT:", res.stdout);
    console.log("STDERR:", res.stderr);
    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
