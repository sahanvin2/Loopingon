async function run() {
  const ids = [
    '56c7bedb-f58e-4145-94af-9adba963ef9a',
    '36052b3b-6021-4b9f-9ac5-a53902d46c68',
    '919c9ae2-e82e-4b3e-a50e-fb0a08e2014b',
    '3d35c169-3e9c-43f6-b994-f4a0a0e761aa',
    'db77e5c5-bf77-4093-a798-b4e2ca4b035f'
  ];
  for (const id of ids) {
    const url = 'https://kandyam.com/api/v1/products/' + id + '/related';
    try {
      const res = await fetch(url);
      const data = await res.json();
      console.log(id, '=>', data.data?.length);
    } catch (e) {
      console.error(id, '=>', e.message);
    }
  }
}
run();
