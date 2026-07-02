const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa', tryKeyboard: true }).then(async () => {
  const service = `[Unit]
Description=Supabase Proxy Service
After=network.target

[Service]
ExecStart=/usr/bin/socat TCP4-LISTEN:5433,fork,reuseaddr TCP6:db.lbrggticuwyqmdtllxsh.supabase.co:5432
Restart=always
User=root

[Install]
WantedBy=multi-user.target`;

  await ssh.execCommand(`echo "${service}" > /etc/systemd/system/supabase-proxy.service`);
  await ssh.execCommand('systemctl daemon-reload');
  await ssh.execCommand('systemctl enable supabase-proxy');
  await ssh.execCommand('systemctl restart supabase-proxy');
  const status = await ssh.execCommand('systemctl status supabase-proxy');
  console.log('STATUS:', status.stdout || status.stderr);
  ssh.dispose();
});
