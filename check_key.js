async function run() {
  const html = await fetch('https://kandyam.com').then(r => r.text());
  const jsFiles = [...html.matchAll(/src=\"([^\"]+\.js)\"/g)].map(m => m[1]);
  let found = false;
  for (const f of jsFiles) {
    const url = f.startsWith('http') ? f : 'https://kandyam.com' + f;
    const t = await fetch(url).then(r => r.text());
    if (t.includes('sb_publishable_OMPVDw-0Yj5dhHMb4VFnjA_K6_GBPNi')) {
      console.log('KEY FOUND IN ' + f);
      found = true;
    }
  }
  if (!found) console.log('KEY NOT FOUND');
}
run();
