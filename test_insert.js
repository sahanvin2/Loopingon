const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:%4020040301Sahan@165.227.90.181:5433/postgres' });
client.connect().then(async () => {
  try {
    const res = await client.query(`INSERT INTO public.users (id, email, "fullName") VALUES ('9b6a368d-efd8-425d-a96e-9278b5d91089', 'snawarathne60@gmail.com', 'Sahan') RETURNING *`);
    console.log('INSERT SUCCESS:', res.rows);
  } catch(e) {
    console.log('INSERT ERROR:', e.message);
  }
  client.end();
}).catch(e => console.log('CONNECT ERROR:', e.message));
