const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
ssh.connect({ host: '165.227.90.181', username: 'root', password: '@20040301Sa' }).then(async () => {
  const res = await ssh.execCommand('curl -i "http://localhost:4000/api/v1/auth/google/callback?id=109926869337572385257&authUserId=9b6a368d-efd8-425d-a96e-9278b5d91089&email=snawarathne60%40gmail.com&name=Sahan+nawarathne&picture=https%3A%2F%2Flh3.googleusercontent.com%2Fa%2FACg8ocK8jYxhW7Efigb2qGjB2THibRyA3UZ9uU14EyXGBcLD0Lz_vw%3Ds96-c"');
  console.log('CURL_RES:', res.stdout);
  ssh.dispose();
}).catch(e => console.log('ERROR:', e.message));
