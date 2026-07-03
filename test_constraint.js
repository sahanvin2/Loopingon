const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:%4020040301Sahan@165.227.90.181:5433/postgres' });
client.connect().then(async () => {
  const res = await client.query(`SELECT conname, pg_get_constraintdef(c.oid) FROM pg_constraint c JOIN pg_namespace n ON n.oid = c.connamespace WHERE conname = 'profiles_id_fkey'`);
  console.log('CONSTRAINT:', res.rows);
  client.end();
}).catch(e => console.log('ERROR:', e.message))
