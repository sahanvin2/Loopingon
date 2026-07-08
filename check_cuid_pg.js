const { Client } = require('pg');
async function run() {
  const client = new Client({
    connectionString: 'postgresql://postgres.lbrggticuwyqmdtllxsh:%4020040301Sahan@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres'
  });
  try {
    await client.connect();
    const res = await client.query("SELECT * FROM products WHERE id::text = 'clyo1t294000308j1h7c2p2e3';");
    console.log(res.rows);
  } catch(e) {
    console.error(e);
  } finally {
    client.end();
  }
}
run();
