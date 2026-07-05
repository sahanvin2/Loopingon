const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    console.log('Connecting to DigitalOcean droplet...');
    await ssh.connect({ host: '134.209.68.3', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Checking swap...');
    const swapCheck = await ssh.execCommand('swapon --show');
    if (swapCheck.stdout.includes('swapfile')) {
      console.log('Swap is already configured.');
    } else {
      console.log('Adding 2GB swap space...');
      await ssh.execCommand('fallocate -l 2G /swapfile');
      await ssh.execCommand('chmod 600 /swapfile');
      await ssh.execCommand('mkswap /swapfile');
      await ssh.execCommand('swapon /swapfile');
      await ssh.execCommand('echo "/swapfile none swap sw 0 0" >> /etc/fstab');
      console.log('Swap space added successfully.');
    }
    
    const free = await ssh.execCommand('free -h');
    console.log(free.stdout);
    
    ssh.dispose();
  } catch(e) { console.error(e); }
}
run();
