const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    const files = [
      'apps/web/package.json',
      'package-lock.json',
      'docker/nginx/nginx.conf'
    ];

    console.log('Copying updated files for performance fix...');
    for (const file of files) {
      console.log(`Uploading ${file}...`);
      await ssh.putFile(file, `/opt/loopingon/${file}`);
    }

    console.log('Building web image...');
    const webBuild = await ssh.execCommand('docker build -t registry.digitalocean.com/loopingon/web:latest -f apps/web/Dockerfile .', { cwd: '/opt/loopingon' });
    console.log(webBuild.stdout);
    if(webBuild.stderr) console.error(webBuild.stderr);
    console.log('WEB BUILD SUCCESS');

    console.log('Restarting containers...');
    await ssh.execCommand('docker compose up -d nginx web', { cwd: '/opt/loopingon/docker' });

    console.log('Done!');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
run();
