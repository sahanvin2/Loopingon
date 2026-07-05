const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    console.log('Connecting to DigitalOcean droplet...');
    await ssh.connect({
      host: '159.65.227.217',
      username: 'root',
      password: '@20040301Sa',
      tryKeyboard: true,
    });
    console.log('Connected successfully!');

    // Upload and run setup-droplet.sh
    console.log('Uploading provisioning script...');
    await ssh.putFile('d:/Mern/Loopingon/loopingon/setup-droplet.sh', '/root/setup-droplet.sh');
    
    console.log('Running provisioning script (this may take a few minutes)...');
    const provision = await ssh.execCommand('chmod +x /root/setup-droplet.sh && /root/setup-droplet.sh', {
      onStdout(chunk) {
        process.stdout.write(chunk.toString('utf8'));
      },
      onStderr(chunk) {
        process.stderr.write(chunk.toString('utf8'));
      },
    });
    
    if (provision.code !== 0) {
      console.error('Script failed with exit code:', provision.code);
    } else {
      console.log('\nServer update complete! Your site should be up.');
    }
    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
