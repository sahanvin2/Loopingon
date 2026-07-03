const { Client } = require('pg');

async function run() {
  const url = 'postgresql://postgres:@20040301Sahan@db.lbrggticuwyqmdtllxsh.supabase.co:5432/postgres';
  const client = new Client({ connectionString: url });
  try {
    await client.connect();
    
    // Check tables in public schema
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    console.log("Tables:", res.rows.map(r => r.table_name));

    // Check count of products
    if (res.rows.find(r => r.table_name === 'products')) {
      const pRes = await client.query('SELECT count(*) FROM products;');
      console.log("Products count:", pRes.rows[0].count);
    }
    
    await client.end();
  } catch (err) {
    console.error(err);
  }
}
run();
