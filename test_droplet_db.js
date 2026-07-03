const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Testing connection from droplet...');
    const script = `
const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:%4020040301Sahan@db.lbrggticuwyqmdtllxsh.supabase.co:5432/postgres' });
client.connect()
  .then(() => { console.log('Connected!'); client.end(); })
  .catch(err => { console.error('Error:', err.message); });
`;
    await ssh.execCommand(`echo "${script}" > /tmp/test_pg.js && node /tmp/test_pg.js`);
    
    // Also ping to see if it resolves
    const resPing = await ssh.execCommand('ping -c 1 db.lbrggticuwyqmdtllxsh.supabase.co');
    console.log("Ping STDOUT:", resPing.stdout);
    console.log("Ping STDERR:", resPing.stderr);

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
