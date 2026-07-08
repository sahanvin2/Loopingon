const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
    try {
        await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
        
        let res = await ssh.execCommand('docker ps --format "{{.Names}}"');
        console.log("--- Running containers ---");
        console.log(res.stdout);

        let webContainer = res.stdout.split('\n').find(c => c.includes('web') || c.includes('loopingon-web') || c.includes('kandyam'));
        if (webContainer) {
            res = await ssh.execCommand(`docker inspect ${webContainer} | grep -i source`);
            console.log(`--- Volumes for ${webContainer} ---`);
            console.log(res.stdout);
        }

        console.log("--- Check if /opt/loopingon exists ---");
        res = await ssh.execCommand('ls -l /opt/loopingon');
        console.log(res.stdout);

        ssh.dispose();
    } catch (e) {
        console.error(e);
        ssh.dispose();
    }
}
run();
