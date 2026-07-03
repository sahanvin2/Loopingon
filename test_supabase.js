const { Client } = require('pg');

async function testConnection(url) {
  const client = new Client({ connectionString: url });
  try {
    await client.connect();
    const res = await client.query('SELECT current_database();');
    console.log('Connected successfully to:', res.rows[0].current_database);
    await client.end();
  } catch (err) {
    console.error('Connection failed for URL:', url, err.message);
  }
}

// Supabase cloud connection string pattern
// postgres://[db-user].[project-ref]:[db-password]@[hostname]:[port]/[dbname]
const urlsToTest = [
  'postgresql://postgres.lbrggticuwyqmdtllxsh:@20040301Sahan@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres',
  'postgresql://postgres.lbrggticuwyqmdtllxsh:@20040301Sa@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres',
  'postgresql://postgres.lbrggticuwyqmdtllxsh:Sahan@20040301@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres',
  'postgresql://postgres:@20040301Sahan@db.lbrggticuwyqmdtllxsh.supabase.co:5432/postgres',
  'postgresql://postgres:@20040301Sa@db.lbrggticuwyqmdtllxsh.supabase.co:5432/postgres'
];

async function run() {
  for (const url of urlsToTest) {
    console.log('Testing', url);
    await testConnection(url);
  }
}
run();
