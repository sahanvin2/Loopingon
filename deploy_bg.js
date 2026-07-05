const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    const script = `cd /opt/loopingon
git checkout -- .
git pull origin main
docker build -t registry.digitalocean.com/loopingon/server:latest -f apps/server/Dockerfile .
docker build -t registry.digitalocean.com/loopingon/web:latest -f apps/web/Dockerfile .
cd docker
docker compose up -d
echo Done
`;
    await ssh.execCommand('cat << "EOF" > /tmp/build.sh\n' + script + 'EOF\nchmod +x /tmp/build.sh\nnohup /tmp/build.sh > /tmp/build.log 2>&1 &');
    console.log('Started.');
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
run();
