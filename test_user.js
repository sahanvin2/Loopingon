const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:%4020040301Sahan@165.227.90.181:5433/postgres' });
client.connect().then(async () => {
  const res = await client.query(`SELECT id, email FROM auth.users WHERE id = '9b6a368d-efd8-425d-a96e-9278b5d91089'`);
  console.log('AUTH USERS:', res.rows);
  client.end();
}).catch(e => console.log('ERROR:', e.message));
