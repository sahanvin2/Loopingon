const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Testing Supabase PG direct connection (Session Mode 5432)...');
    
    // We update .env file and docker/.env file to use Session Mode
    // Host: aws-0-ap-southeast-1.pooler.supabase.com
    // Port: 5432
    // DB Name: postgres
    // User: postgres.lbrggticuwyqmdtllxsh
    const url = 'postgresql://postgres.lbrggticuwyqmdtllxsh:%4020040301Sahan@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres';
    
    // Replace in /opt/loopingon/.env
    await ssh.execCommand(`sed -i 's|DATABASE_URL=.*|DATABASE_URL=${url}|g' /opt/loopingon/.env`);
    
    // Replace in /opt/loopingon/docker/.env
    await ssh.execCommand(`sed -i 's|DATABASE_URL=.*|DATABASE_URL=${url}|g' /opt/loopingon/docker/.env`);
    
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
