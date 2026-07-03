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

const urlsToTest = [
  'postgresql://postgres:%4020040301Sahan@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?options=project%3Dlbrggticuwyqmdtllxsh',
  'postgresql://postgres:%4020040301Sahan@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?options=project%3Dlbrggticuwyqmdtllxsh'
];

async function run() {
  for (const url of urlsToTest) {
    console.log('Testing', url);
    await testConnection(url);
  }
}
run();
