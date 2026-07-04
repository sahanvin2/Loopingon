const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    console.log("Connecting to Droplet...");
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log("Connected. Pulling changes from Git...");
    // Let's find the loopingon directory first
    const findDir = await ssh.execCommand('find / -maxdepth 3 -type d -name "loopingon" | head -n 1');
    const projectDir = findDir.stdout.trim() || '/opt/loopingon';
    console.log(`Project directory found at: ${projectDir}`);

    console.log('Running git pull...');
    const pull = await ssh.execCommand('git pull origin main', { cwd: projectDir });
    console.log(pull.stdout);
    if(pull.stderr) console.error(pull.stderr);

    console.log('Building web app...');
    const webBuild = await ssh.execCommand('npm install && npm run build', { cwd: `${projectDir}/apps/web` });
    console.log(webBuild.stdout);
    if(webBuild.stderr) console.error(webBuild.stderr);

    console.log('Building server app...');
    const serverBuild = await ssh.execCommand('npm install && npx prisma generate && npm run build', { cwd: `${projectDir}/apps/server` });
    console.log(serverBuild.stdout);
    if(serverBuild.stderr) console.error(serverBuild.stderr);

    console.log('Restarting services with pm2...');
    const pm2 = await ssh.execCommand('pm2 restart all');
    console.log(pm2.stdout);
    if(pm2.stderr) console.error(pm2.stderr);

    console.log('Done!');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
run();
