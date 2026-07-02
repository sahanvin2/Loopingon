/**
 * B2 Image Upload Script
 * 1. Maps product names to product codes from Excel
 * 2. Uploads all 36k images from local folder to B2 in parallel
 * 3. Updates product_images table with B2 URLs
 */
import { createClient } from "@supabase/supabase-js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

// === CONFIG ===
const SUPABASE_URL = "https://lbrggticuwyqmdtllxsh.supabase.co";
const SUPABASE_KEY = "REMOVED_SECRET";

const B2_ENDPOINT = "https://s3.us-east-005.backblazeb2.com";
const B2_ACCESS_KEY = "0053aaa597862ee0000000001";
const B2_SECRET_KEY = "K005kVHvMmLD696fVPINAqzU2wW+HGs";
const B2_BUCKET = "movia-prod";
const B2_PUBLIC_BASE = "https://f005.backblazeb2.com/file/movia-prod";

const EXCEL_FILE = "D:\\Mern\\Loopingon\\loopingon\\Assets\\kandyam_products.xlsx";
const IMAGES_DIR = "D:\\Python\\Data scrap\\product_images\\With text file\\product_images";

const CONCURRENT_UPLOADS = 15; // Parallel uploads

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const s3 = new S3Client({
  endpoint: B2_ENDPOINT,
  region: "us-east-005",
  credentials: { accessKeyId: B2_ACCESS_KEY, secretAccessKey: B2_SECRET_KEY },
  forcePathStyle: true,
  maxAttempts: 3,
});

function generateUUID(): string {
  return crypto.randomUUID();
}

// === STEP 1: Build product name -> product code mapping from Excel ===
function buildProductMap(): Map<string, { code: string; id: string }> {
  console.log("=== Building product name map from Excel ===");
  const workbook = XLSX.readFile(EXCEL_FILE);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rawData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  const map = new Map<string, { code: string; id: string }>();
  for (let i = 1; i < rawData.length; i++) {
    const row = rawData[i];
    if (!row || row.length < 3) continue;
    const name = String(row[3] || "").trim();
    const code = String(row[1] || "").trim();
    if (!name || !code) continue;
    // Store both exact and lowercase for fuzzy matching
    map.set(name.toLowerCase(), { code, id: "" });
  }
  console.log(`  ${map.size} product names mapped`);
  return map;
}

// === STEP 2: Get existing product IDs from Supabase ===
async function getProductIds(): Promise<Map<string, string>> {
  console.log("=== Fetching product IDs from Supabase ===");
  const idMap = new Map<string, string>();
  let page = 0;
  const pageSize = 1000;
  while (true) {
    const { data, error } = await supabase
      .from("products")
      .select("id, sku, title")
      .range(page * pageSize, (page + 1) * pageSize - 1);
    if (error || !data || data.length === 0) break;
    for (const p of data) {
      if (p.sku) idMap.set(p.sku, p.id);
      idMap.set(p.title.toLowerCase(), p.id);
    }
    page++;
    if (data.length < pageSize) break;
  }
  console.log(`  ${idMap.size} product IDs fetched`);
  return idMap;
}

// === STEP 3: Upload single image to B2 ===
async function uploadToB2(
  localPath: string,
  remoteKey: string
): Promise<string | null> {
  try {
    const fileBuffer = fs.readFileSync(localPath);
    const ext = path.extname(localPath).toLowerCase();
    const contentType =
      ext === ".png" ? "image/png"
      : ext === ".webp" ? "image/webp"
      : ext === ".gif" ? "image/gif"
      : "image/jpeg";

    await s3.send(
      new PutObjectCommand({
        Bucket: B2_BUCKET,
        Key: remoteKey,
        Body: fileBuffer,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      })
    );
    return `${B2_PUBLIC_BASE}/${remoteKey}`;
  } catch (err: any) {
    console.error(`  Upload failed: ${path.basename(localPath)} - ${err.message?.slice(0, 80)}`);
    return null;
  }
}

// === STEP 4: Process all folders ===
async function processAllFolders(
  productIdMap: Map<string, string>,
  productNameMap: Map<string, { code: string; id: string }>
) {
  console.log("=== Scanning image folders ===");

  const folders = fs
    .readdirSync(IMAGES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory());

  console.log(`  Total folders: ${folders.length}`);

  // Match folders to products
  const matched: { folderName: string; productCode: string; productId: string; images: string[] }[] = [];
  const unmatched: string[] = [];

  for (const folder of folders) {
    const folderName = folder.name;
    const images = fs
      .readdirSync(path.join(IMAGES_DIR, folderName))
      .filter((f) => {
        const ext = f.toLowerCase();
        return ext.endsWith(".jpg") || ext.endsWith(".jpeg") || ext.endsWith(".png") || ext.endsWith(".webp") || ext.endsWith(".gif");
      })
      .sort();

    if (images.length === 0) continue;

    // Try exact match first
    let productCode = productNameMap.get(folderName.toLowerCase())?.code;
    let productId = "";

    if (productCode) {
      productId = productIdMap.get(productCode) || "";
    }

    // Try fuzzy match: product list contains folder name
    if (!productCode) {
      for (const [name, info] of productNameMap) {
        if (name.includes(folderName.toLowerCase()) || folderName.toLowerCase().includes(name)) {
          productCode = info.code;
          productId = productIdMap.get(productCode) || "";
          break;
        }
      }
    }

    if (productCode && productId) {
      matched.push({ folderName, productCode, productId, images });
    } else {
      unmatched.push(folderName);
    }
  }

  console.log(`  Matched: ${matched.length} folders`);
  console.log(`  Unmatched: ${unmatched.length} folders`);
  console.log(`  Total images to upload: ${matched.reduce((s, m) => s + m.images.length, 0)}`);

  if (unmatched.length > 0 && unmatched.length < 30) {
    console.log(`  Unmatched folders: ${unmatched.join(", ")}`);
  }

  return matched;
}

// === STEP 5: Upload images in parallel batches and update DB ===
async function uploadAndUpdate(
  matched: { folderName: string; productCode: string; productId: string; images: string[] }[]
) {
  console.log("\n=== Uploading images to B2 and updating database ===");

  // First, clear existing product_images
  console.log("  Clearing old product_images...");
  const { error: delErr } = await supabase
    .from("product_images")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (delErr) console.log(`  Delete warning: ${delErr.message?.slice(0, 80)}`);
  else console.log("  Old images cleared");

  let totalUploaded = 0;
  let totalDbInserted = 0;
  let totalFailures = 0;
  const startTime = Date.now();

  // Process each product
  for (let pIdx = 0; pIdx < matched.length; pIdx++) {
    const m = matched[pIdx];
    const { productCode, productId, images } = m;

    // Upload images in parallel batches within each product
    const imageRecords: any[] = [];
    
    for (let i = 0; i < images.length; i += CONCURRENT_UPLOADS) {
      const batch = images.slice(i, i + CONCURRENT_UPLOADS);
      const uploadPromises = batch.map(async (imgFile, batchIdx) => {
        const imgIdx = i + batchIdx;
        const localPath = path.join(IMAGES_DIR, m.folderName, imgFile);
        const ext = path.extname(imgFile);
        const remoteKey = `products/${productCode}/${productCode}_${imgIdx + 1}${ext}`;
        return { url: await uploadToB2(localPath, remoteKey), sortOrder: imgIdx, fileName: imgFile };
      });

      const results = await Promise.all(uploadPromises);
      
      for (const r of results) {
        if (r.url) {
          totalUploaded++;
          imageRecords.push({
            id: generateUUID(),
            product_id: productId,
            url: r.url,
            thumbnail: r.url,
            medium: r.url,
            large: r.url,
            alt: `${m.folderName} ${r.sortOrder + 1}`,
            sort_order: r.sortOrder,
            is_primary: r.sortOrder === 0,
          });
        } else {
          totalFailures++;
        }
      }
    }

    // Insert image records for this product to DB
    if (imageRecords.length > 0) {
      // Insert in batches of 500
      for (let j = 0; j < imageRecords.length; j += 500) {
        const batch = imageRecords.slice(j, j + 500);
        const { error } = await supabase.from("product_images").insert(batch);
        if (error) {
          console.log(`  DB insert error for ${productCode}: ${error.message?.slice(0, 80)}`);
        } else {
          totalDbInserted += batch.length;
        }
      }
    }

    // Progress
    if ((pIdx + 1) % 100 === 0 || pIdx === matched.length - 1) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const pct = ((pIdx + 1) / matched.length * 100).toFixed(1);
      const rate = Math.floor(totalUploaded / Math.max(elapsed, 1));
      console.log(`  [${pct}%] ${pIdx + 1}/${matched.length} folders | Uploaded: ${totalUploaded} | DB: ${totalDbInserted} | Failures: ${totalFailures} | ${rate} img/s | ${elapsed}s`);
    }
  }

  return { totalUploaded, totalDbInserted, totalFailures };
}

// === MAIN ===
async function main() {
  console.log("======================================");
  console.log("  B2 Image Upload & DB Update");
  console.log("======================================");
  console.log(`  B2 Bucket: ${B2_BUCKET}`);
  console.log(`  Public Base: ${B2_PUBLIC_BASE}`);
  console.log(`  Images Dir: ${IMAGES_DIR}`);
  console.log("======================================\n");

  const productNameMap = buildProductMap();
  const productIdMap = await getProductIds();
  const matched = await processAllFolders(productIdMap, productNameMap);

  if (matched.length === 0) {
    console.log("No products matched! Check folder names vs product names.");
    return;
  }

  const result = await uploadAndUpdate(matched);

  console.log("\n======================================");
  console.log("  UPLOAD COMPLETE");
  console.log("======================================");
  console.log(`  Images uploaded to B2: ${result.totalUploaded}`);
  console.log(`  DB records inserted: ${result.totalDbInserted}`);
  console.log(`  Failures: ${result.totalFailures}`);

  // Final verification
  const { count: imgCount } = await supabase
    .from("product_images")
    .select("*", { count: "exact", head: true });
  console.log(`  Total images in DB: ${imgCount}`);
  console.log(`  B2 Public URL: ${B2_PUBLIC_BASE}/products/`);
}

main().catch(console.error);
