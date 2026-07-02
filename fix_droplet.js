const { NodeSSH } = require('node-ssh');
const fs = require('fs');

async function fixDroplet() {
  const ssh = new NodeSSH();
  try {
    console.log("Connecting to droplet...");
    await ssh.connect({
      host: '165.227.90.181',
      username: 'root',
      password: '@20040301Sa',
      tryKeyboard: true
    });
    console.log("Connected!");

    // Read local env and nginx conf
    let rootEnv = fs.readFileSync('d:/Mern/Loopingon/loopingon/.env', 'utf8');
    rootEnv = rootEnv.replace('redis://localhost:6379', 'redis://redis:6379');
    const nginxConf = fs.readFileSync('d:/Mern/Loopingon/loopingon/docker/nginx/nginx.conf', 'utf8');

    // Create a bash script to overwrite the remote .env and restart containers
    const script = `
cd /opt/loopingon
cat << 'EOF' > .env
${rootEnv}
EOF

cat << 'EOF' > docker/nginx/nginx.conf
${nginxConf}
EOF

sudo docker restart loopingon-nginx-prod
    `;

    console.log("Running fix script...");
    const result = await ssh.execCommand(script);
    console.log("STDOUT:", result.stdout);
    console.error("STDERR:", result.stderr);

  } catch (err) {
    console.error("SSH Error:", err);
  } finally {
    ssh.dispose();
  }
}

fixDroplet();
