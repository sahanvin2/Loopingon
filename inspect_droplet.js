const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });

    console.log('=== DOCKER CONTAINERS ===');
    const ps = await ssh.execCommand('docker ps -a --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"');
    console.log(ps.stdout);
    if (ps.stderr) console.log('PS ERR:', ps.stderr);

    console.log('\n=== DOCKER IMAGES ===');
    const imgs = await ssh.execCommand('docker images --format "table {{.Repository}}\\t{{.Tag}}\\t{{.CreatedAt}}\\t{{.Size}}"');
    console.log(imgs.stdout);
    if (imgs.stderr) console.log('IMG ERR:', imgs.stderr);

    console.log('\n=== SERVER CONTAINER LOGS (last 50) ===');
    const slog = await ssh.execCommand('docker logs loopingon-server-prod --tail 50 2>&1');
    console.log(slog.stdout || slog.stderr);

    console.log('\n=== WEB CONTAINER LOGS (last 50) ===');
    const wlog = await ssh.execCommand('docker logs loopingon-web-prod --tail 50 2>&1');
    console.log(wlog.stdout || wlog.stderr);

    console.log('\n=== NGINX CONTAINER LOGS (last 20) ===');
    const nlog = await ssh.execCommand('docker logs loopingon-nginx-prod --tail 20 2>&1');
    console.log(nlog.stdout || nlog.stderr);

    console.log('\n=== DISK SPACE ===');
    const df = await ssh.execCommand('df -h /');
    console.log(df.stdout);

    console.log('\n=== ENV FILES ===');
    const envCheck = await ssh.execCommand('ls -la /opt/loopingon/.env /opt/loopingon/docker/.env 2>&1');
    console.log(envCheck.stdout || envCheck.stderr);

    console.log('\n=== DOCKER COMPOSE CONFIG ===');
    const dcConfig = await ssh.execCommand('docker compose config 2>&1', { cwd: '/opt/loopingon/docker' });
    console.log(dcConfig.stdout ? dcConfig.stdout.substring(0, 500) : dcConfig.stderr);

    console.log('\n=== GIT STATUS ===');
    const git = await ssh.execCommand('git log --oneline -5', { cwd: '/opt/loopingon' });
    console.log(git.stdout);

    console.log('\n=== DOCKERFILE SERVER EXISTS ===');
    const dfs = await ssh.execCommand('head -10 /opt/loopingon/apps/server/Dockerfile');
    console.log(dfs.stdout || 'NOT FOUND');

    console.log('\n=== DOCKERFILE WEB EXISTS ===');
    const dfw = await ssh.execCommand('head -10 /opt/loopingon/apps/web/Dockerfile');
    console.log(dfw.stdout || 'NOT FOUND');

    ssh.dispose();
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
run();
