const { Client } = require('pg');

async function testConnection() {
  const client = new Client({
    host: 'aws-0-ap-southeast-1.pooler.supabase.com',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: '@20040301Sahan',
    ssl: {
      rejectUnauthorized: false,
      servername: 'db.lbrggticuwyqmdtllxsh.supabase.co'
    }
  });
  try {
    await client.connect();
    const res = await client.query('SELECT current_database();');
    console.log('Connected successfully to:', res.rows[0].current_database);
    await client.end();
  } catch (err) {
    console.error('Connection failed:', err.message);
  }
}

testConnection();
