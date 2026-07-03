async function run() {
  const html = await fetch('https://kandyam.com').then(r => r.text());
  const jsFiles = [...html.matchAll(/src=\"([^\"]+\.js)\"/g)].map(m => m[1]);
  console.log(jsFiles.length + ' JS files found');
  let found = false;
  for (const f of jsFiles) {
    const url = f.startsWith('http') ? f : 'https://kandyam.com' + f;
    const t = await fetch(url).then(r => r.text());
    if (t.includes('lbrggticuwyqmdtllxsh.supabase.co')) {
      console.log('FOUND IN ' + f);
      found = true;
    }
  }
  if (!found) console.log('NOT FOUND');
  console.log('DONE');
}
run();
