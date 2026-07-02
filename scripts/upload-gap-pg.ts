/**
 * Fill missing images - uses direct PG for unlimited queries
 */
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import { Pool } from "pg";

const PG_URL = "postgresql://postgres:@20040301Sahan@db.lbrggticuwyqmdtllxsh.supabase.co:5432/postgres";
const B2_ENDPOINT = "https://s3.us-east-005.backblazeb2.com";
const B2_KEY = "0053aaa597862ee0000000001";
const B2_SECRET = "K005kVHvMmLD696fVPINAqzU2wW+HGs";
const B2_BUCKET = "movia-prod";
const B2_BASE = "https://f005.backblazeb2.com/file/movia-prod";
const EXCEL = "D:\\Mern\\Loopingon\\loopingon\\Assets\\kandyam_products.xlsx";
const IMG_DIR = "D:\\Python\\Data scrap\\product_images\\With text file\\product_images";
const CONCURRENT = 20;

const pool = new Pool({ connectionString: PG_URL, ssl: { rejectUnauthorized: false }, max: 5 });
const s3 = new S3Client({
  endpoint: B2_ENDPOINT, region: "us-east-005",
  credentials: { accessKeyId: B2_KEY, secretAccessKey: B2_SECRET },
  forcePathStyle: true, maxAttempts: 3,
});

async function uploadB2(lp: string, rk: string): Promise<string | null> {
  try {
    const buf = fs.readFileSync(lp);
    const e = path.extname(lp).toLowerCase();
    const ct = e === ".png" ? "image/png" : e === ".webp" ? "image/webp" : e === ".gif" ? "image/gif" : "image/jpeg";
    await s3.send(new PutObjectCommand({
      Bucket: B2_BUCKET, Key: rk, Body: buf,
      ContentType: ct, CacheControl: "public, max-age=31536000, immutable",
    }));
    return `${B2_BASE}/${rk}`;
  } catch { return null; }
}

async function main() {
  console.log("=== Fill Missing Images (Direct PG) ===\n");
  const pg = await pool.connect();

  try {
    // 1. Build Excel name→sku map
    const wb = XLSX.readFile(EXCEL);
    const raw: any[][] = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 });
    const nameToSku = new Map<string, string>();
    for (let i = 1; i < raw.length; i++) {
      const r = raw[i]; if (!r || r.length < 3) continue;
      const n = String(r[3] || "").trim().toLowerCase();
      const s = String(r[1] || "").trim();
      if (n && s) nameToSku.set(n, s);
    }

    // 2. Get products WITHOUT images (unlimited via PG)
    const missRes = await pg.query(
      `SELECT p.id, p.sku, p.title FROM public.products p WHERE NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi."productId" = p.id)`
    );
    const missing = missRes.rows;
    console.log(`Products missing images: ${missing.length}`);

    if (missing.length === 0) { console.log("All done!"); return; }

    // 3. Build title→product map for missing products
    const prodByTitle = new Map<string, { id: string; sku: string }>();
    for (const p of missing) {
      prodByTitle.set(p.title.toLowerCase(), { id: p.id, sku: p.sku });
    }

    // 4. Scan folders
    const folders = fs.readdirSync(IMG_DIR, { withFileTypes: true })
      .filter(d => d.isDirectory());
    
    const folderImgs = new Map<string, string[]>();
    for (const f of folders) {
      const imgs = fs.readdirSync(path.join(IMG_DIR, f.name))
        .filter(fn => /\.(jpg|jpeg|png|webp|gif)$/i.test(fn))
        .sort();
      if (imgs.length > 0) folderImgs.set(f.name, imgs);
    }
    console.log(`Folders with images: ${folderImgs.size}`);

    // 5. Match & upload
    let uploaded = 0, failed = 0, matched = 0;
    const start = Date.now();

    for (const prod of missing) {
      const t = prod.title.toLowerCase().trim();

      // Find folder
      let folderName: string | null = null;
      if (folderImgs.has(prod.title)) {
        folderName = prod.title;
      } else {
        for (const [fn] of folderImgs) {
          const fl = fn.toLowerCase().trim();
          if (fl === t || fl.includes(t) || t.includes(fl)) {
            folderName = fn; break;
          }
        }
      }
      if (!folderName) continue;
      matched++;

      const imgs = folderImgs.get(folderName)!;
      const records: { id: string; product_id: string; url: string; thumbnail: string; medium: string; large: string; alt: string; sort_order: number; is_primary: boolean }[] = [];

      for (let i = 0; i < imgs.length; i += CONCURRENT) {
        const batch = imgs.slice(i, i + CONCURRENT);
        const results = await Promise.all(
          batch.map(async (fn, bi) => {
            const idx = i + bi;
            const url = await uploadB2(
              path.join(IMG_DIR, folderName!, fn),
              `products/${prod.sku}/${prod.sku}_${idx + 1}${path.extname(fn)}`
            );
            return url ? { url, sort: idx } : null;
          })
        );
        for (const r of results) {
          if (r) {
            records.push({
              id: crypto.randomUUID(), product_id: prod.id,
              url: r.url, thumbnail: r.url, medium: r.url, large: r.url,
              alt: `${prod.title} ${r.sort + 1}`,
              sort_order: r.sort, is_primary: r.sort === 0,
            });
          } else failed++;
        }
      }

      // Insert via PG for speed
      if (records.length > 0) {
        for (let j = 0; j < records.length; j += 500) {
          const b = records.slice(j, j + 500);
          const vals = b.map((r, ri) =>
            `('${r.id}','${r.product_id}','${r.url}','${r.thumbnail}','${r.medium}','${r.large}','${r.alt.replace(/'/g,"''")}',${r.sort_order},${r.is_primary},NOW())`
          ).join(",");
          await pg.query(`INSERT INTO public.product_images (id, "productId", url, thumbnail, medium, large, alt, "sortOrder", "isPrimary", "createdAt") VALUES ${vals} ON CONFLICT DO NOTHING`);
          uploaded += b.length;
        }
      }

      if (matched % 100 === 0) {
        const el = Math.floor((Date.now() - start) / 1000);
        console.log(`  ${matched} folders | ${uploaded} imgs | ${el}s`);
      }
    }

    const el = Math.floor((Date.now() - start) / 1000);
    const cnt = await pg.query('SELECT COUNT(*) FROM public.product_images');
    const pc = await pg.query('SELECT COUNT(DISTINCT "productId") FROM public.product_images');
    const tc = await pg.query("SELECT COUNT(*) FROM public.products");
    const stillMissing = await pg.query('SELECT COUNT(*) FROM public.products p WHERE NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi."productId" = p.id)');
    console.log(`\n=== DONE ===`);
    console.log(`  Images: ${cnt.rows[0].count} | Products with images: ${pc.rows[0].count} / ${tc.rows[0].count}`);
    console.log(`  Still missing: ${stillMissing.rows[0].count}`);
    console.log(`  Uploaded: ${uploaded} | Failed: ${failed} | Time: ${el}s`);
  } finally {
    pg.release();
    pool.end();
  }
}

main().catch(console.error);
