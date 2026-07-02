const { Client } = require('pg');

const projectRef = 'lbrggticuwyqmdtllxsh';
const password = '%4020040301Sahan';
const decodedPassword = decodeURIComponent(password);

const regions = [
  'us-east-1',
  'us-west-1',
  'us-west-2',
  'ap-southeast-1',
  'ap-northeast-1',
  'ap-northeast-2',
  'ap-southeast-2',
  'ap-south-1',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'eu-central-1',
  'ca-central-1',
  'sa-east-1',
];

async function testConnection(region) {
  const connectionString = `postgresql://postgres.${projectRef}:${decodedPassword}@aws-0-${region}.pooler.supabase.com:6543/postgres`;
  const client = new Client({ connectionString, connectionTimeoutMillis: 5000 });
  try {
    await client.connect();
    console.log(`Success! Connected using region: ${region}`);
    console.log(`Connection String: ${connectionString}`);
    await client.end();
    return true;
  } catch (err) {
    // console.log(`Failed for region ${region}: ${err.message}`);
    return false;
  }
}

async function main() {
  for (const region of regions) {
    console.log(`Testing region ${region}...`);
    const success = await testConnection(region);
    if (success) {
      process.exit(0);
    }
  }
  console.log('Could not connect to any pooler region.');
}

main();
