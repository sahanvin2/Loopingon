const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    console.log('Checking images...');
    const res = await ssh.execCommand('docker exec loopingon-postgres-prod psql -U loopingon -d loopingon -c "SELECT id, title, (SELECT count(*) FROM product_images WHERE product_images.\\"productId\\" = products.id) as image_count FROM products;"');
    console.log("STDOUT:", res.stdout);
    console.log("STDERR:", res.stderr);
    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
