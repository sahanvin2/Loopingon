const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const ssh = new NodeSSH();
async function run() {
  try {
    let localEnv = fs.readFileSync('.env', 'utf8');
    // Modify DATABASE_URL for droplet
    localEnv = localEnv.replace(
      'DATABASE_URL=postgresql://postgres:%4020040301Sahan@172.17.0.1:5433/postgres',
      'DATABASE_URL=postgresql://postgres:%4020040301Sahan@172.18.0.1:5433/postgres'
    );
    
    // Also change Redis to point to redis container (in docker-compose it's REDIS_URL=redis://localhost:6379 locally, but on droplet it should be redis://redis:6379, wait, docker-compose overrides REDIS_URL in environment variable, so it doesn't matter)
    
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Uploading .env to droplet...');
    fs.writeFileSync('.env.droplet', localEnv);
    await ssh.putFile('.env.droplet', '/opt/loopingon/.env');
    await ssh.putFile('.env.droplet', '/opt/loopingon/docker/.env');
    
    console.log('Restarting ALL containers...');
    const res = await ssh.execCommand('cd /opt/loopingon && docker compose -f docker/docker-compose.prod.yml up -d');
    console.log("STDOUT:", res.stdout);

    await ssh.execCommand('cd /opt/loopingon && docker compose -f docker/docker-compose.prod.yml restart nginx');

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
