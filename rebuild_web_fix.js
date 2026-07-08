const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
    try {
        await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
        
        console.log("Uploading fixed Dockerfile to droplet...");
        // upload to both possible locations
        await ssh.putFile('apps/web/Dockerfile', '/var/www/kandyam/apps/web/Dockerfile').catch(() => {});
        await ssh.putFile('apps/web/Dockerfile', '/opt/loopingon/apps/web/Dockerfile').catch(() => {});

        console.log("Rebuilding web container in /var/www/kandyam ...");
        let res = await ssh.execCommand('docker compose -f docker-compose.yml build web', { cwd: '/var/www/kandyam/docker' });
        console.log("BUILD OUT:", res.stdout);
        console.log("BUILD ERR:", res.stderr);

        console.log("Restarting web container ...");
        res = await ssh.execCommand('docker compose -f docker-compose.yml up -d web', { cwd: '/var/www/kandyam/docker' });
        console.log("UP OUT:", res.stdout);
        console.log("UP ERR:", res.stderr);

        ssh.dispose();
    } catch (e) {
        console.error(e);
        ssh.dispose();
    }
}
run();
