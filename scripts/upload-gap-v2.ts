/**
 * Fill missing product images from folderized database
 * Maps 7767 folders → product codes → uploads to B2 → updates DB
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
const B2_KEY = "0053aaa597862ee0000000001";
const B2_SECRET = "K005kVHvMmLD696fVPINAqzU2wW+HGs";
const B2_BUCKET = "movia-prod";
const B2_BASE = "https://f005.backblazeb2.com/file/movia-prod";
const EXCEL = "D:\\Mern\\Loopingon\\loopingon\\Assets\\kandyam_products.xlsx";
const IMG_DIR = "D:\\Python\\Data scrap\\product_images\\With text file\\product_images";
const CONCURRENT = 20;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const s3 = new S3Client({
  endpoint: B2_ENDPOINT, region: "us-east-005",
  credentials: { accessKeyId: B2_KEY, secretAccessKey: B2_SECRET },
  forcePathStyle: true, maxAttempts: 3,
});

// === Build product name → { sku, id } from Excel ===
function buildExcelMap(): Map<string, { sku: string }> {
  const wb = XLSX.readFile(EXCEL);
  const raw: any[][] = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 });
  const m = new Map<string, { sku: string }>();
  for (let i = 1; i < raw.length; i++) {
    const r = raw[i]; if (!r || r.length < 3) continue;
    const name = String(r[3] || "").trim();
    const sku = String(r[1] || "").trim();
    if (name && sku) m.set(name.toLowerCase(), { sku });
  }
  return m;
}

// === Upload to B2 ===
async function uploadB2(localPath: string, remoteKey: string): Promise<string | null> {
  try {
    const buf = fs.readFileSync(localPath);
    const e = path.extname(localPath).toLowerCase();
    const ct = e === ".png" ? "image/png" : e === ".webp" ? "image/webp" : e === ".gif" ? "image/gif" : "image/jpeg";
    await s3.send(new PutObjectCommand({
      Bucket: B2_BUCKET, Key: remoteKey, Body: buf,
      ContentType: ct, CacheControl: "public, max-age=31536000, immutable",
    }));
    return `${B2_BASE}/${remoteKey}`;
  } catch { return null; }
}

// === Fuzzy match folder to product ===
function findMatch(folder: string, productMap: Map<string, { id: string; sku: string }>): { id: string; sku: string } | null {
  const key = folder.toLowerCase().trim();
  if (productMap.has(key)) return productMap.get(key)!;
  // Try matching
  for (const [prodName, info] of productMap) {
    if (prodName.includes(key) || key.includes(prodName)) return info;
  }
  return null;
}

async function main() {
  console.log("=== Fill Missing Product Images ===\n");

  // 1. Build Excel map
  console.log("Reading Excel...");
  const excelMap = buildExcelMap();
  console.log(`  ${excelMap.size} products in Excel`);

  // 2. Get products from DB
  console.log("Fetching products without images...");
  const { data: allProds } = await supabase.from("products").select("id, sku, title");
  if (!allProds) { console.log("No products!"); return; }

  // 3. Get existing image product IDs
  const { data: imgData } = await supabase.from("product_images").select("productId");
  const hasImg = new Set<string>();
  if (imgData) for (const x of imgData) hasImg.add(x.productId);

  // 4. Filter missing
  const prodMap = new Map<string, { id: string; sku: string }>();
  const missing = [];
  for (const p of allProds) {
    prodMap.set(p.title.toLowerCase(), { id: p.id, sku: p.sku });
    if (!hasImg.has(p.id)) missing.push(p);
  }
  console.log(`  Total: ${allProds.length} | With images: ${hasImg.size} | Missing: ${missing.length}\n`);

  if (missing.length === 0) { console.log("All products have images!"); return; }

  // 5. Scan folders
  console.log("Scanning image folders...");
  const folders = fs.readdirSync(IMG_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory());

  // Build folder → images map
  const folderImgs = new Map<string, string[]>();
  for (const f of folders) {
    const imgs = fs.readdirSync(path.join(IMG_DIR, f.name))
      .filter(fn => {
        const e = fn.toLowerCase();
        return e.endsWith(".jpg") || e.endsWith(".jpeg") || e.endsWith(".png") || e.endsWith(".webp") || e.endsWith(".gif");
      })
      .sort();
    if (imgs.length > 0) folderImgs.set(f.name, imgs);
  }
  console.log(`  ${folderImgs.size} folders with images`);

  // 6. Match and upload
  console.log("Matching & uploading...");
  let uploaded = 0;
  let matched = 0;
  let failed = 0;
  const start = Date.now();

  for (const prod of missing) {
    // Skip if already has images (double check)
    if (hasImg.has(prod.id)) continue;

    // Find matching folder
    const match = findMatch(prod.title, prodMap);
    if (!match) continue;

    // Check if there's a folder for this product
    let folderName: string | null = null;
    const titleLower = prod.title.toLowerCase().trim();
    if (folderImgs.has(prod.title)) {
      folderName = prod.title;
    } else {
      // Case-insensitive folder lookup
      for (const [fn, imgs] of folderImgs) {
        if (fn.toLowerCase().trim() === titleLower || fn.toLowerCase().trim().includes(titleLower) || titleLower.includes(fn.toLowerCase().trim())) {
          folderName = fn;
          break;
        }
      }
    }

    if (!folderName) continue;
    matched++;

    const imgs = folderImgs.get(folderName)!;
    const records: any[] = [];

    // Upload in parallel batches
    for (let i = 0; i < imgs.length; i += CONCURRENT) {
      const batch = imgs.slice(i, i + CONCURRENT);
      const results = await Promise.all(
        batch.map(async (fn, bi) => {
          const idx = i + bi;
          const lp = path.join(IMG_DIR, folderName!, fn);
          const ext = path.extname(fn);
          const rk = `products/${prod.sku}/${prod.sku}_${idx + 1}${ext}`;
          const url = await uploadB2(lp, rk);
          return url ? { url, sort: idx } : null;
        })
      );

      for (const r of results) {
        if (r) {
          records.push({
            id: crypto.randomUUID(),
            product_id: prod.id,
            url: r.url, thumbnail: r.url, medium: r.url, large: r.url,
            alt: `${prod.title} ${r.sort + 1}`,
            sort_order: r.sort,
            is_primary: r.sort === 0,
          });
        } else {
          failed++;
        }
      }
    }

    if (records.length > 0) {
      // Insert in batches
      for (let j = 0; j < records.length; j += 500) {
        const batch = records.slice(j, j + 500);
        const { error } = await supabase.from("product_images").insert(batch);
        if (!error) uploaded += batch.length;
      }
      hasImg.add(prod.id);
    }

    if (matched % 200 === 0) {
      const el = Math.floor((Date.now() - start) / 1000);
      const pct = ((missing.filter(p => hasImg.has(p.id)).length / missing.length) * 100).toFixed(1);
      console.log(`  ${matched} folders | ${uploaded} images | ${pct}% | ${el}s`);
    }
  }

  const el = Math.floor((Date.now() - start) / 1000);
  const doneCount = missing.filter(p => hasImg.has(p.id)).length;
  console.log(`\n=== DONE: ${doneCount}/${missing.length} products filled ===`);
  console.log(`  Uploaded: ${uploaded} images | Failed: ${failed} | Time: ${el}s`);

  // Final verify
  const { count: fi } = await supabase.from("product_images").select("*", { count: "exact", head: true });
  const { data: ai } = await supabase.from("product_images").select("productId");
  const up = new Set(ai?.map(x => x.productId));
  console.log(`\n  Total images in DB: ${fi}`);
  console.log(`  Products with images: ${up.size} / ${allProds.length}`);
  console.log(`  Still missing: ${allProds.length - up.size}`);
}

main().catch(console.error);
