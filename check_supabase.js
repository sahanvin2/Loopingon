fetch('https://lbrggticuwyqmdtllxsh.supabase.co/rest/v1/', {
  headers: {
    'apikey': 'sb_publishable_OMPVDw-0Yj5dhHMb4VFnjA_K6_GBPNi'
  }
})
.then(res => {
  console.log('Status:', res.status);
  process.exit(0);
})
.catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
