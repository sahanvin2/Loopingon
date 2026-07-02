const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    console.log('Connecting to DigitalOcean droplet...');
    await ssh.connect({
      host: '165.227.90.181',
      username: 'root',
      password: '@20040301Sa',
      tryKeyboard: true,
    });
    console.log('Connected successfully!');

    // 1. Upload and run setup-droplet.sh
    console.log('Uploading provisioning script...');
    await ssh.putFile('d:/Mern/Loopingon/loopingon/setup-droplet.sh', '/root/setup-droplet.sh');
    
    console.log('Running provisioning script (this may take a few minutes)...');
    const provision = await ssh.execCommand('chmod +x /root/setup-droplet.sh && /root/setup-droplet.sh');
    console.log(provision.stdout || provision.stderr);

    console.log('Server update complete! Your site should be up with HTTPS.');
    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
