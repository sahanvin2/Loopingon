/**
 * Complete image gap fill
 * 1. Uses product_images_final (P-code named files)
 * 2. Uses remaining folders from main product_images
 * Only uploads for products missing images
 */
import { createClient } from "@supabase/supabase-js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
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
const FINAL_IMAGES = "D:\\Mern\\Loopingon\\loopingon\\Assets\\product_images_final";
const FOLDER_IMAGES = "D:\\Python\\Data scrap\\product_images\\With text file\\product_images";
const CONCURRENT = 20;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
const s3 = new S3Client({ endpoint: B2_ENDPOINT, region: "us-east-005", credentials: { accessKeyId: B2_KEY, secretAccessKey: B2_SECRET }, forcePathStyle: true, maxAttempts: 3 });

async function upload(localPath: string, remoteKey: string): Promise<string | null> {
  try {
    const buf = fs.readFileSync(localPath);
    const ext = path.extname(localPath).toLowerCase();
    const ct = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : ext === ".gif" ? "image/gif" : "image/jpeg";
    await s3.send(new PutObjectCommand({ Bucket: B2_BUCKET, Key: remoteKey, Body: buf, ContentType: ct, CacheControl: "public, max-age=31536000, immutable" }));
    return `${B2_BASE}/${remoteKey}`;
  } catch (e: any) { return null; }
}

async function main() {
  console.log("=== Gap Fill: Uploading missing images ===\n");

  // Get products without images
  console.log("Fetching products without images...");
  const { data: noImgProducts } = await supabase
    .from("products")
    .select("id, sku, title");
  
  if (!noImgProducts) { console.log("No products found"); return; }

  // Get products that have images
  const { data: imgData } = await supabase
    .from("product_images")
    .select("productId");

  const hasImg = new Set<string>();
  if (imgData) for (const x of imgData) hasImg.add(x.productId);

  const missing = noImgProducts.filter(p => !hasImg.has(p.id));
  console.log(`Total products: ${noImgProducts.length}`);
  console.log(`With images: ${hasImg.size}`);
  console.log(`Missing images: ${missing.length}\n`);

  // Build SKU -> product map
  const skuMap = new Map<string, { id: string; title: string }>();
  for (const p of missing) {
    if (p.sku) skuMap.set(p.sku.trim().toUpperCase(), { id: p.id, title: p.title });
  }

  // === SOURCE 1: product_images_final (P-code files) ===
  console.log("=== Source 1: product_images_final ===");
  const finalFiles = fs.readdirSync(FINAL_IMAGES)
    .filter(f => {
      const ext = f.toLowerCase();
      return ext.endsWith(".jpg") || ext.endsWith(".jpeg") || ext.endsWith(".png") || ext.endsWith(".webp");
    });

  const pCodeFiles = finalFiles.filter(f => /^P\d+\./i.test(f));
  console.log(`  Total files: ${finalFiles.length}, P-code: ${pCodeFiles.length}`);

  let uploaded1 = 0;
  const processed = new Set<string>();

  for (const file of pCodeFiles) {
    const code = path.parse(file).name.toUpperCase(); // P00001
    if (!skuMap.has(code)) continue;
    if (processed.has(code)) continue;
    processed.add(code);

    const prod = skuMap.get(code)!;
    const localPath = path.join(FINAL_IMAGES, file);
    const ext = path.extname(file);
    const remoteKey = `products/${code}/${code}_1${ext}`;

    const url = await upload(localPath, remoteKey);
    if (url) {
      await supabase.from("product_images").insert({
        id: crypto.randomUUID(),
        product_id: prod.id,
        url, thumbnail: url, medium: url, large: url,
        alt: prod.title,
        sort_order: 0,
        is_primary: true,
      });
      uploaded1++;
      hasImg.add(prod.id);
    }
  }

  console.log(`  Uploaded: ${uploaded1}`);
  console.log(`  Remaining missing: ${missing.length - uploaded1}\n`);

  // === SOURCE 2: Main product_images folders ===
  console.log("=== Source 2: Product image folders ===");
  const remaining = missing.filter(p => !hasImg.has(p.id));
  console.log(`  Still missing: ${remaining.length}`);

  // Build lowercase title map
  const titleMap = new Map<string, { id: string; sku: string }>();
  for (const p of remaining) {
    titleMap.set(p.title.toLowerCase(), { id: p.id, sku: p.sku });
  }

  const folders = fs.readdirSync(FOLDER_IMAGES, { withFileTypes: true })
    .filter(d => d.isDirectory());

  let uploaded2 = 0;
  let matched = 0;

  for (const folder of folders) {
    const fName = folder.name.toLowerCase();
    let prodInfo = titleMap.get(fName);
    
    // Fuzzy match
    if (!prodInfo) {
      for (const [title, info] of titleMap) {
        if (title.includes(fName) || fName.includes(title)) {
          prodInfo = info;
          break;
        }
      }
    }

    if (!prodInfo || hasImg.has(prodInfo.id)) continue;
    matched++;

    const imgs = fs.readdirSync(path.join(FOLDER_IMAGES, folder.name))
      .filter(f => {
        const e = f.toLowerCase();
        return e.endsWith(".jpg") || e.endsWith(".jpeg") || e.endsWith(".png") || e.endsWith(".webp") || e.endsWith(".gif");
      })
      .sort()
      .slice(0, 5); // Max 5 images per product

    if (imgs.length === 0) continue;

    const records: any[] = [];
    for (let i = 0; i < imgs.length; i += CONCURRENT) {
      const batch = imgs.slice(i, i + CONCURRENT);
      const results = await Promise.all(batch.map(async (fn, bi) => {
        const idx = i + bi;
        const lp = path.join(FOLDER_IMAGES, folder.name, fn);
        const ext = path.extname(fn);
        const rk = `products/${prodInfo!.sku}/${prodInfo!.sku}_${idx + 1}${ext}`;
        return { url: await upload(lp, rk), sort: idx };
      }));

      for (const r of results) {
        if (r.url) {
          records.push({
            id: crypto.randomUUID(),
            product_id: prodInfo.id,
            url: r.url, thumbnail: r.url, medium: r.url, large: r.url,
            alt: `${folder.name} ${r.sort + 1}`,
            sort_order: r.sort,
            is_primary: r.sort === 0,
          });
        }
      }
    }

    if (records.length > 0) {
      for (let j = 0; j < records.length; j += 500) {
        await supabase.from("product_images").insert(records.slice(j, j + 500));
      }
      uploaded2 += records.length;
      hasImg.add(prodInfo.id);
    }

    if (matched % 100 === 0) {
      console.log(`  Processed: ${matched} folders | Uploaded: ${uploaded2}`);
    }
  }

  console.log(`  Matched folders: ${matched}`);
  console.log(`  Images uploaded: ${uploaded2}\n`);

  // === Final stats ===
  const { count: finalImgs } = await supabase.from("product_images").select("*", { count: "exact", head: true });
  const { count: finalProds } = await supabase.from("products").select("*", { count: "exact", head: true });
  const { data: allImg } = await supabase.from("product_images").select("productId");
  const allProdIds = new Set(allImg?.map(x => x.productId));
  const finalMissing = finalProds! - allProdIds.size;

  console.log("======================================");
  console.log("  UPLOAD COMPLETE");
  console.log("======================================");
  console.log(`  Source 1 (final): ${uploaded1}`);
  console.log(`  Source 2 (folders): ${uploaded2}`);
  console.log(`  Total uploaded: ${uploaded1 + uploaded2}`);
  console.log(`  Total images in DB: ${finalImgs}`);
  console.log(`  Products with images: ${allProdIds.size}`);
  console.log(`  Still missing: ${finalMissing}`);
}

main().catch(console.error);
