async function run() {
  const url = 'https://kandyam.com/api/v1/products/56c7bedb-f58e-4145-94af-9adba963ef9a/related';
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log(JSON.stringify(data).substring(0, 500));
    console.log('length:', data.data?.length);
  } catch (e) {
    console.error(e);
  }
}
run();
