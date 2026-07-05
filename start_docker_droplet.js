const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    console.log('Connecting to DigitalOcean droplet...');
    await ssh.connect({
      host: '134.209.68.3',
      username: 'root',
      password: '@20040301Sa',
      tryKeyboard: true,
    });
    console.log('Connected successfully!');

    console.log('Syncing modified files...');
    await ssh.putFile('apps/web/src/app/sitemap.ts', '/opt/loopingon/apps/web/src/app/sitemap.ts');
    await ssh.putFile('apps/web/Dockerfile', '/opt/loopingon/apps/web/Dockerfile');


    console.log('Building server image...');
    await ssh.execCommand('docker build -t registry.digitalocean.com/loopingon/server:latest -f apps/server/Dockerfile .', { 
      cwd: '/opt/loopingon',
      onStdout: (c) => process.stdout.write(c.toString('utf8')),
      onStderr: (c) => process.stderr.write(c.toString('utf8'))
    });

    console.log('Building web image...');
    await ssh.execCommand('docker build -t registry.digitalocean.com/loopingon/web:latest -f apps/web/Dockerfile .', { 
      cwd: '/opt/loopingon',
      onStdout: (c) => process.stdout.write(c.toString('utf8')),
      onStderr: (c) => process.stderr.write(c.toString('utf8'))
    });

    console.log('Building nginx image...');
    await ssh.execCommand('docker build -t registry.digitalocean.com/loopingon/nginx:latest -f docker/nginx/Dockerfile docker/nginx', { 
      cwd: '/opt/loopingon',
      onStdout: (c) => process.stdout.write(c.toString('utf8')),
      onStderr: (c) => process.stderr.write(c.toString('utf8'))
    });

    console.log('Starting Docker Compose...');
    await ssh.execCommand('touch docker/.env', { cwd: '/opt/loopingon' });
    const result = await ssh.execCommand('docker compose -f docker/docker-compose.prod.yml up -d', { 
      cwd: '/opt/loopingon',
      onStdout: (c) => process.stdout.write(c.toString('utf8')),
      onStderr: (c) => process.stderr.write(c.toString('utf8'))
    });
    
    if (result.code !== 0) {
      console.error('Docker compose failed with exit code:', result.code);
    } else {
      console.log('\nDocker compose complete! Your site should be up.');
    }
    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
