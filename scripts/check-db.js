const { Pool } = require("pg");
const pool = new Pool({
  connectionString: "postgresql://postgres:@20040301Sahan@db.lbrggticuwyqmdtllxsh.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false },
});

async function ck() {
  const client = await pool.connect();
  try {
    const r1 = await client.query("SELECT COUNT(*) as cnt FROM public.product_images");
    const r2 = await client.query('SELECT COUNT(DISTINCT "productId") as cnt FROM public.product_images');
    const r3 = await client.query("SELECT COUNT(*) as cnt FROM public.products");
    const r4 = await client.query('SELECT COUNT(*) as cnt FROM public.products p WHERE NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi."productId" = p.id)');
    console.log("Images total:", r1.rows[0].cnt);
    console.log("Products with images:", r2.rows[0].cnt);
    console.log("Products total:", r3.rows[0].cnt);
    console.log("Products WITHOUT images:", r4.rows[0].cnt);
  } finally {
    client.release();
    pool.end();
  }
}
ck();
