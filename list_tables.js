const { Client } = require('pg');
async function run() {
  const client = new Client({
    connectionString: 'postgresql://postgres.lbrggticuwyqmdtllxsh:%4020040301Sahan@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres'
  });
  try {
    await client.connect();
    const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';");
    console.log(res.rows);
  } catch(e) {
    console.error(e);
  } finally {
    client.end();
  }
}
run();
