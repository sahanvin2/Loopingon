// Check and fix price mismatches vs Excel
const { Pool } = require("pg");
const XLSX = require("xlsx");

const pool = new Pool({
  connectionString: "postgresql://postgres:@20040301Sahan@db.lbrggticuwyqmdtllxsh.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false },
});

async function main() {
  const pg = await pool.connect();
  try {
    // Read Excel prices
    const wb = XLSX.readFile("D:\\Mern\\Loopingon\\loopingon\\Assets\\kandyam_products.xlsx");
    const raw = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 });
    
    const excelPrices = new Map();
    for (let i = 1; i < raw.length; i++) {
      const r = raw[i]; if (!r || r.length < 3) continue;
      const code = String(r[1] || "").trim();
      if (!code) continue;
      const kStr = String(r[9] || "0").replace(/[^0-9.]/g, "");
      const cStr = String(r[7] || "0").replace(/[^0-9.]/g, "");
      const status = String(r[12] || "DRAFT").trim().toUpperCase().replace(/ /g, "_");
      const qty = parseInt(String(r[13] || "0").replace(/[^0-9]/g, "")) || 0;
      const desc = String(r[28] || "").trim();
      excelPrices.set(code, {
        price: parseFloat(kStr) || 0,
        compareAt: parseFloat(cStr) || 0,
        status,
        qty,
        desc,
      });
    }

    console.log(`Excel products: ${excelPrices.size}`);

    // Get DB products
    const dbRes = await pg.query('SELECT id, sku, price, "compareAtPrice", status, quantity FROM public.products');
    console.log(`DB products: ${dbRes.rows.length}`);

    let mismatches = 0;
    let fixed = 0;
    let skipped = 0;

    for (const prod of dbRes.rows) {
      const excel = excelPrices.get(prod.sku);
      if (!excel) { skipped++; continue; }

      const dbPrice = parseFloat(prod.price);
      const excelPrice = excel.price;
      const dbCompareAt = prod.compareAtPrice ? parseFloat(prod.compareAtPrice) : 0;
      const excelCompareAt = excel.compareAt;

      let needsUpdate = false;
      const updates: string[] = [];

      // Check price (allow 1 LKR difference for rounding)
      if (Math.abs(dbPrice - excelPrice) > 1 && excelPrice > 0) {
        updates.push(`price = ${excelPrice}`);
        needsUpdate = true;
      }

      // Check compareAt
      if (Math.abs(dbCompareAt - excelCompareAt) > 1 && excelCompareAt > 0 && dbCompareAt === 0) {
        updates.push(`"compareAtPrice" = ${excelCompareAt}`);
        needsUpdate = true;
      }

      // Check status
      if (prod.status !== excel.status && excel.status) {
        updates.push(`status = '${excel.status}'::\"ProductStatus\"`);
        needsUpdate = true;
      }

      // Check quantity
      if (parseInt(prod.quantity) !== excel.qty && excel.qty >= 0) {
        updates.push(`quantity = ${excel.qty}`);
        needsUpdate = true;
      }

      if (needsUpdate) {
        mismatches++;
        if (mismatches <= 10) {
          console.log(`  ${prod.sku}: DB=${dbPrice} Excel=${excelPrice} | ${updates.join(", ")}`);
        }
        try {
          await pg.query(`UPDATE public.products SET ${updates.join(", ")} WHERE id = '${prod.id}'`);
          fixed++;
        } catch (e) {
          // skip
        }
      }
    }

    console.log(`\nMismatches found: ${mismatches}`);
    console.log(`Fixed: ${fixed}`);
    console.log(`Skipped (no Excel match): ${skipped}`);

    // Sample 5 products to verify
    const sample = await pg.query('SELECT sku, title, price, "compareAtPrice", status, quantity FROM public.products LIMIT 5');
    console.log("\nSample products:");
    for (const s of sample.rows) {
      console.log(`  ${s.sku} | ${s.title} | LKR ${s.price} | Qty: ${s.quantity} | ${s.status}`);
    }
  } finally {
    pg.release();
    pool.end();
  }
}

main();
