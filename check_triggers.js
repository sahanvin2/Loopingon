const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  try {
    await ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true });
    
    console.log('Querying triggers...');
    const cmd = `export $(cat /opt/loopingon/.env | grep DATABASE_URL) && docker exec loopingon-postgres-prod psql $DATABASE_URL -c "SELECT trigger_name, event_object_table FROM information_schema.triggers;"`;
    const res = await ssh.execCommand(cmd);
    console.log(res.stdout);

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
}
run();
