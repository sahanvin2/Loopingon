const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '165.227.90.181',
      username: 'root',
      password: '@20040301Sa',
      tryKeyboard: true,
    });
    
    console.log("Pulling latest code...");
    const pull = await ssh.execCommand('git pull origin main', { cwd: '/opt/loopingon' });
    console.log(pull.stdout || pull.stderr);

    console.log("Building and starting production containers locally...");
    const build = await ssh.execCommand('docker compose --env-file .env -f docker/docker-compose.build.yml up -d --build', { cwd: '/opt/loopingon' });
    console.log(build.stdout || build.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    if(ssh) ssh.dispose();
  }
}

run();
