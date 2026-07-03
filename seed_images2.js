const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    console.log('Seeding images...');
    const query = `INSERT INTO product_images (id, "productId", url, thumbnail, medium, large) SELECT gen_random_uuid(), id, 'https://kandyam-media.sgp1.digitaloceanspaces.com/seed/products/' || slug || '.jpg', 'https://kandyam-media.sgp1.digitaloceanspaces.com/seed/products/' || slug || '.jpg', 'https://kandyam-media.sgp1.digitaloceanspaces.com/seed/products/' || slug || '.jpg', 'https://kandyam-media.sgp1.digitaloceanspaces.com/seed/products/' || slug || '.jpg' FROM products ON CONFLICT DO NOTHING;`;
    const res = await ssh.execCommand(`docker exec loopingon-postgres-prod psql -U loopingon -d loopingon -c "${query}"`);
    console.log("STDOUT:", res.stdout);
    console.log("STDERR:", res.stderr);
    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
