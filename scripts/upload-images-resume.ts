/**
 * B2 Image Upload - Resume
 * Only uploads images for products that don't have images yet
 */
import { createClient } from "@supabase/supabase-js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

const SUPABASE_URL = "https://lbrggticuwyqmdtllxsh.supabase.co";
const SUPABASE_KEY = "REMOVED_SECRET";
const B2_ENDPOINT = "https://s3.us-east-005.backblazeb2.com";
const B2_ACCESS_KEY = "0053aaa597862ee0000000001";
const B2_SECRET_KEY = "K005kVHvMmLD696fVPINAqzU2wW+HGs";
const B2_BUCKET = "movia-prod";
const B2_PUBLIC_BASE = "https://f005.backblazeb2.com/file/movia-prod";
const EXCEL_FILE = "D:\\Mern\\Loopingon\\loopingon\\Assets\\kandyam_products.xlsx";
const IMAGES_DIR = "D:\\Python\\Data scrap\\product_images\\With text file\\product_images";
const CONCURRENT = 20;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
const s3 = new S3Client({ endpoint: B2_ENDPOINT, region: "us-east-005", credentials: { accessKeyId: B2_ACCESS_KEY, secretAccessKey: B2_SECRET_KEY }, forcePathStyle: true, maxAttempts: 3 });

function genUUID() { return crypto.randomUUID(); }

function buildProductMap() {
  console.log("=== Building product map ===");
  const wb = XLSX.readFile(EXCEL_FILE);
  const raw: any[][] = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 });
  const map = new Map<string, string>();
  for (let i = 1; i < raw.length; i++) {
    const r = raw[i]; if (!r || r.length < 3) continue;
    const name = String(r[3] || "").trim();
    const code = String(r[1] || "").trim();
    if (name && code) map.set(name.toLowerCase(), code);
  }
  console.log(`  ${map.size} names mapped`);
  return map;
}

async function getProductsWithImages(): Promise<Set<string>> {
  console.log("=== Getting products that already have images ===");
  const { data } = await supabase.from("product_images").select("product_id");
  const ids = new Set<string>();
  if (data) for (const img of data) ids.add(img.product_id);
  console.log(`  ${ids.size} products already have images`);
  return ids;
}

async function getProductIdMap(): Promise<Map<string, string>> {
  console.log("=== Fetching product IDs ===");
  const map = new Map<string, string>();
  let page = 0;
  while (true) {
    const { data } = await supabase.from("products").select("id, sku, title").range(page * 1000, (page + 1) * 1000 - 1);
    if (!data || data.length === 0) break;
    for (const p of data) {
      if (p.sku) map.set(p.sku, p.id);
      map.set(p.title.toLowerCase(), p.id);
    }
    page++;
    if (data.length < 1000) break;
  }
  console.log(`  ${map.size} product IDs`);
  return map;
}

async function upload(imgPath: string, remoteKey: string): Promise<string | null> {
  try {
    const buf = fs.readFileSync(imgPath);
    const ext = path.extname(imgPath).toLowerCase();
    const ct = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : ext === ".gif" ? "image/gif" : "image/jpeg";
    await s3.send(new PutObjectCommand({ Bucket: B2_BUCKET, Key: remoteKey, Body: buf, ContentType: ct, CacheControl: "public, max-age=31536000, immutable" }));
    return `${B2_PUBLIC_BASE}/${remoteKey}`;
  } catch (e: any) { return null; }
}

async function main() {
  console.log("=== B2 Upload Resume ===\n");
  const nameMap = buildProductMap();
  const productsWithImages = await getProductsWithImages();
  const idMap = await getProductIdMap();

  const folders = fs.readdirSync(IMAGES_DIR, { withFileTypes: true }).filter(d => d.isDirectory());
  console.log(`\n=== Processing ${folders.length} folders ===`);

  const toProcess: { folder: string; code: string; pid: string; images: string[] }[] = [];

  for (const f of folders) {
    const code = nameMap.get(f.name.toLowerCase());
    if (!code) continue;
    const pid = idMap.get(code);
    if (!pid) continue;
    if (productsWithImages.has(pid)) continue;

    const imgs = fs.readdirSync(path.join(IMAGES_DIR, f.name)).filter(fn => {
      const e = fn.toLowerCase();
      return e.endsWith(".jpg") || e.endsWith(".jpeg") || e.endsWith(".png") || e.endsWith(".webp") || e.endsWith(".gif");
    }).sort();

    if (imgs.length > 0) toProcess.push({ folder: f.name, code, pid, images: imgs });
  }

  console.log(`  Products to process: ${toProcess.length}`);
  console.log(`  Total images: ${toProcess.reduce((s, p) => s + p.images.length, 0)}\n`);

  let uploaded = 0, dbInserted = 0, failures = 0;
  const start = Date.now();

  for (let i = 0; i < toProcess.length; i++) {
    const p = toProcess[i];
    const records: any[] = [];

    for (let j = 0; j < p.images.length; j += CONCURRENT) {
      const batch = p.images.slice(j, j + CONCURRENT);
      const results = await Promise.all(batch.map(async (fn, bi) => {
        const idx = j + bi;
        const lp = path.join(IMAGES_DIR, p.folder, fn);
        const ext = path.extname(fn);
        const rk = `products/${p.code}/${p.code}_${idx + 1}${ext}`;
        return { url: await upload(lp, rk), sort: idx };
      }));

      for (const r of results) {
        if (r.url) {
          uploaded++;
          records.push({ id: genUUID(), product_id: p.pid, url: r.url, thumbnail: r.url, medium: r.url, large: r.url, alt: `${p.folder} ${r.sort + 1}`, sort_order: r.sort, is_primary: r.sort === 0 });
        } else failures++;
      }
    }

    if (records.length > 0) {
      for (let k = 0; k < records.length; k += 500) {
        await supabase.from("product_images").insert(records.slice(k, k + 500));
        dbInserted += Math.min(500, records.length - k);
      }
    }

    if ((i + 1) % 100 === 0 || i === toProcess.length - 1) {
      const el = Math.floor((Date.now() - start) / 1000);
      console.log(`  ${i + 1}/${toProcess.length} | Up: ${uploaded} | DB: ${dbInserted} | Fail: ${failures} | ${el}s`);
    }
  }

  console.log(`\n=== DONE: ${uploaded} uploaded, ${dbInserted} in DB, ${failures} failures ===`);
  const { count } = await supabase.from("product_images").select("*", { count: "exact", head: true });
  console.log(`Total images in DB: ${count}`);
}

main().catch(console.error);
