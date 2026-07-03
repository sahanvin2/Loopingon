const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    const sql = `INSERT INTO product_images (id, "productId", url, thumbnail, medium, large, "isPrimary", "sortOrder", "createdAt", "updatedAt") SELECT gen_random_uuid(), id, 'https://kandyam-media.sgp1.digitaloceanspaces.com/seed/products/' || slug || '.jpg', 'https://kandyam-media.sgp1.digitaloceanspaces.com/seed/products/' || slug || '.jpg', 'https://kandyam-media.sgp1.digitaloceanspaces.com/seed/products/' || slug || '.jpg', 'https://kandyam-media.sgp1.digitaloceanspaces.com/seed/products/' || slug || '.jpg', true, 0, NOW(), NOW() FROM products ON CONFLICT DO NOTHING;`;
    
    const b64 = Buffer.from(sql).toString('base64');
    
    console.log('Writing SQL to droplet via base64...');
    await ssh.execCommand(`echo '${b64}' | base64 -d > /root/seed_images.sql`);
    
    console.log('Copying to container...');
    await ssh.execCommand('docker cp /root/seed_images.sql loopingon-postgres-prod:/tmp/seed_images.sql');
    
    console.log('Running SQL...');
    const res = await ssh.execCommand('docker exec loopingon-postgres-prod psql -U loopingon -d loopingon -f /tmp/seed_images.sql');
    console.log("STDOUT:", res.stdout);
    console.log("STDERR:", res.stderr);
    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
