const dns = require('dns');
const regions = ['us-east-1', 'us-east-2', 'us-west-1', 'us-west-2', 'eu-central-1', 'eu-west-1', 'eu-west-2', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'ap-northeast-2', 'ap-south-1', 'sa-east-1', 'ca-central-1'];

Promise.all(regions.map(r => new Promise(res => {
  dns.resolve4(`aws-0-${r}.pooler.supabase.com`, (err, ips) => {
    if (!err && ips.length > 0) res({ region: r, ips });
    else res(null);
  });
}))).then(results => {
  const valid = results.filter(Boolean);
  console.log('VALID POOLERS:', valid);
  const { Client } = require('pg');
  
  async function test() {
    for (let v of valid) {
      const host = `aws-0-${v.region}.pooler.supabase.com`;
      console.log('Testing', host);
      const client = new Client({
        connectionString: `postgresql://postgres.lbrggticuwyqmdtllxsh:%4020040301Sahan@${host}:6543/postgres?pgbouncer=true`
      });
      try {
        await client.connect();
        console.log('SUCCESS! ->', host);
        await client.end();
        return;
      } catch (e) {
        console.log('Failed', host, e.message);
      }
    }
    console.log('None worked.');
  }
  test();
});
