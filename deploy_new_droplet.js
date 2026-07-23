const { NodeSSH } = require('node-ssh');
const path = require('path');
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

    // Upload and run setup-droplet.sh
    console.log('Uploading provisioning script...');
    await ssh.putFile(path.join(__dirname, 'setup-droplet.sh'), '/root/setup-droplet.sh');
    
    console.log('Running provisioning script (this may take a few minutes)...');
    const provision = await ssh.execCommand('sed -i \'s/\\r$//\' /root/setup-droplet.sh && chmod +x /root/setup-droplet.sh && /root/setup-droplet.sh', {
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
      console.log('Running database migrations...');
      await ssh.execCommand('cd /opt/loopingon && docker compose -f docker/docker-compose.prod.yml exec -T server npx prisma db push --accept-data-loss', {
        onStdout: chunk => process.stdout.write(chunk.toString('utf8')),
        onStderr: chunk => process.stderr.write(chunk.toString('utf8')),
      });
      console.log('Seeding database...');
      await ssh.execCommand('cd /opt/loopingon && docker compose -f docker/docker-compose.prod.yml exec -T server npm run db:seed', {
        onStdout: chunk => process.stdout.write(chunk.toString('utf8')),
        onStderr: chunk => process.stderr.write(chunk.toString('utf8')),
      });
      console.log('Seeding images...');
      const sql = `INSERT INTO product_images (id, "productId", url, thumbnail, medium, large, "isPrimary", "sortOrder", "createdAt", "updatedAt") SELECT gen_random_uuid(), id, 'https://kandyam-media.sgp1.digitaloceanspaces.com/seed/products/' || slug || '.jpg', 'https://kandyam-media.sgp1.digitaloceanspaces.com/seed/products/' || slug || '.jpg', 'https://kandyam-media.sgp1.digitaloceanspaces.com/seed/products/' || slug || '.jpg', 'https://kandyam-media.sgp1.digitaloceanspaces.com/seed/products/' || slug || '.jpg', true, 0, NOW(), NOW() FROM products ON CONFLICT DO NOTHING;`;
      const b64 = Buffer.from(sql).toString('base64');
      await ssh.execCommand(`echo '${b64}' | base64 -d > /root/seed_images.sql`);
      await ssh.execCommand('docker cp /root/seed_images.sql loopingon-postgres-prod:/tmp/seed_images.sql');
      await ssh.execCommand('docker exec loopingon-postgres-prod psql -U loopingon -d loopingon -f /tmp/seed_images.sql', {
        onStdout: chunk => process.stdout.write(chunk.toString('utf8')),
        onStderr: chunk => process.stderr.write(chunk.toString('utf8')),
      });

      console.log('\nServer update complete! Your site should be up.');
    }
    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
