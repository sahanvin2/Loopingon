const { Client } = require('pg');
async function run() {
  const client = new Client({
    connectionString: 'postgresql://postgres.lbrggticuwyqmdtllxsh:%4020040301Sahan@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres'
  });
  try {
    await client.connect();
    const res = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'products';");
    console.log(res.rows);
  } catch(e) {
    console.error(e);
  } finally {
    client.end();
  }
}
run();
