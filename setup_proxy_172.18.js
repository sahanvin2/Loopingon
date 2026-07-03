const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Starting socat on 172.18.0.1...');
    const res = await ssh.execCommand('nohup socat TCP4-LISTEN:5433,bind=172.18.0.1,reuseaddr,fork TCP6:2406:da18:e5c:b702:39b0:45b4:b70a:542e:5432 > /var/log/socat-postgres.log 2>&1 &');
    console.log("STDOUT:", res.stdout);
    
    const res2 = await ssh.execCommand('sleep 2 && netstat -tlpn | grep 5433');
    console.log("Netstat:", res2.stdout);

    // Now update .env files
    const url = 'postgresql://postgres:%4020040301Sahan@172.18.0.1:5433/postgres';
    await ssh.execCommand(`sed -i 's|DATABASE_URL=.*|DATABASE_URL=${url}|g' /opt/loopingon/.env`);
    await ssh.execCommand(`sed -i 's|DATABASE_URL=.*|DATABASE_URL=${url}|g' /opt/loopingon/docker/.env`);
    
    console.log('Restarting server...');
    const res3 = await ssh.execCommand('cd /opt/loopingon && docker compose -f docker/docker-compose.prod.yml up -d server worker');
    console.log("Restart STDOUT:", res3.stdout);
    
    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
