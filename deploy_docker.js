const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    console.log("Connecting to Droplet...");
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    const projectDir = '/opt/loopingon';

    console.log('Running git reset and pull...');
    await ssh.execCommand('git checkout -- .', { cwd: projectDir });
    const pull = await ssh.execCommand('git pull origin main', { cwd: projectDir });
    console.log(pull.stdout);
    if(pull.stderr) console.error(pull.stderr);

    console.log('Building server docker image...');
    const serverBuild = await ssh.execCommand('docker build -t registry.digitalocean.com/loopingon/server:latest -f apps/server/Dockerfile .', { cwd: projectDir });
    console.log(serverBuild.stdout);
    if(serverBuild.stderr) console.error(serverBuild.stderr);

    console.log('Building web docker image...');
    const webBuild = await ssh.execCommand('docker build -t registry.digitalocean.com/loopingon/web:latest -f apps/web/Dockerfile .', { cwd: projectDir });
    console.log(webBuild.stdout);
    if(webBuild.stderr) console.error(webBuild.stderr);

    console.log('Restarting containers...');
    const restart = await ssh.execCommand('docker compose up -d', { cwd: `${projectDir}/docker` });
    console.log(restart.stdout);
    if(restart.stderr) console.error(restart.stderr);

    console.log('Done!');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
run();
