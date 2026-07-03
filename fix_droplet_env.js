const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Appending env vars to droplet .env...');
    const appendCmd = `echo "" >> /opt/loopingon/.env && echo "NEXT_PUBLIC_SUPABASE_URL=https://lbrggticuwyqmdtllxsh.supabase.co" >> /opt/loopingon/.env && echo "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_OMPVDw-0Yj5dhHMb4VFnjA_K6_GBPNi" >> /opt/loopingon/.env && echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_OMPVDw-0Yj5dhHMb4VFnjA_K6_GBPNi" >> /opt/loopingon/.env`;
    await ssh.execCommand(appendCmd);
    
    console.log('Rebuilding web container on droplet...');
    const res = await ssh.execCommand('cd /opt/loopingon && docker compose -f docker/docker-compose.prod.yml up -d --build web');
    console.log("STDOUT:", res.stdout);
    console.log("STDERR:", res.stderr);
    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
