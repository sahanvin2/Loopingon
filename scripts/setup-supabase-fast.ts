/**
 * Kandyam Supabase Fast Setup - Products only (no image upload)
 * Uses existing CDN URLs from Excel, inserts products in parallel batches
 * Run: npx tsx scripts/setup-supabase-fast.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";
import * as crypto from "crypto";

const SUPABASE_URL = "https://lbrggticuwyqmdtllxsh.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "REMOVED_SECRET";
const EXCEL_FILE = "D:\\Mern\\Loopingon\\loopingon\\Assets\\kandyam_products.xlsx";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").replace(/-+/g, "-");
}

function generateUUID(): string {
  return crypto.randomUUID();
}

// ========== READ EXCEL ==========
interface ProductRow {
  row: number;
  productCode: string;
  proId: string;
  name: string;
  category: string;
  kandyamPrice: number;
  compareAtPrice: number;
  listedPrice: number;
  seller: string;
  deliveryCharge: number;
  status: string;
  stockQty: number;
  salesCount: number;
  reviews: number;
  rating: number;
  views: number;
  description: string;
  totalImages: number;
  cdnImageUrl: string;
  altCdnImages: string;
  a2zImageUrl: string;
  localImage: string;
  bestImage: string;
  productLink: string;
  variations: string;
  weight: string;
  warranty: string;
}

function readExcel(): ProductRow[] {
  console.log("=== Reading Excel ===");
  const workbook = XLSX.readFile(EXCEL_FILE);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rawData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  console.log(`  Rows: ${rawData.length}`);

  const products: ProductRow[] = [];
  for (let i = 1; i < rawData.length; i++) {
    const row = rawData[i];
    if (!row || row.length < 3) continue;
    const name = String(row[3] || "").trim();
    if (!name) continue;

    const priceStr = String(row[9] || "0").replace(/[^0-9.]/g, "");
    const compareStr = String(row[7] || "0").replace(/[^0-9.]/g, "");
    const kandyamStr = String(row[9] || "0").replace(/[^0-9.]/g, "");

    products.push({
      row: i,
      productCode: String(row[1] || "").trim(),
      proId: String(row[2] || "").trim(),
      name,
      category: String(row[4] || "Other").trim(),
      kandyamPrice: parseFloat(kandyamStr) || 0,
      compareAtPrice: parseFloat(compareStr) || 0,
      listedPrice: parseFloat(String(row[6] || "0").replace(/[^0-9.]/g, "")) || 0,
      seller: String(row[10] || "Kandyam").trim(),
      deliveryCharge: parseInt(String(row[11] || "0").replace(/[^0-9]/g, "")) || 0,
      status: String(row[12] || "DRAFT").trim().toUpperCase().replace(/ /g, "_"),
      stockQty: parseInt(String(row[13] || "0").replace(/[^0-9]/g, "")) || 0,
      salesCount: parseInt(String(row[14] || "0")) || 0,
      reviews: parseInt(String(row[15] || "0")) || 0,
      rating: parseFloat(String(row[16] || "0")) || 0,
      views: parseInt(String(row[17] || "0")) || 0,
      description: String(row[28] || "").trim(),
      totalImages: parseInt(String(row[29] || "0")) || 0,
      cdnImageUrl: String(row[30] || "").trim(),
      altCdnImages: String(row[31] || "").trim(),
      a2zImageUrl: String(row[32] || "").trim(),
      localImage: String(row[33] || "").trim(),
      bestImage: String(row[34] || "").trim(),
      productLink: String(row[36] || "").trim(),
      variations: String(row[24] || "").trim(),
      weight: String(row[27] || "").trim(),
      warranty: String(row[26] || "").trim(),
    });
  }
  console.log(`  Products: ${products.length}`);
  return products;
}

// ========== MAIN ==========
async function main() {
  console.log("======================================");
  console.log("  Kandyam Fast Product Import");
  console.log("======================================\n");

  const products = readExcel();
  if (products.length === 0) {
    console.log("No products found");
    return;
  }

  // Get vendor ID
  const { data: vendor } = await supabase.from("vendors").select("id").eq("store_slug", "kandyam").single();
  if (!vendor) {
    console.error("Vendor not found! Run full setup first.");
    process.exit(1);
  }
  console.log(`Vendor ID: ${vendor.id}\n`);

  // Get categories
  const { data: existingCats } = await supabase.from("categories").select("id, name");
  const catMap: Record<string, string> = {};
  if (existingCats) {
    for (const c of existingCats) catMap[c.name] = c.id;
  }

  // Insert missing categories
  const uniqueCats = [...new Set(products.map((p) => p.category))].filter((c) => c && !catMap[c]);
  for (const cat of uniqueCats) {
    const id = generateUUID();
    const slug = slugify(cat);
    await supabase.from("categories").insert({ id, name: cat, slug, is_active: true, level: 0 });
    catMap[cat] = id;
  }
  console.log(`Categories: ${Object.keys(catMap).length}`);

  const validStatuses = ["DRAFT", "PENDING_REVIEW", "PUBLISHED", "REJECTED", "OUT_OF_STOCK", "DISCONTINUED", "FLAGGED"];

  // Check existing products
  const { count: existingCount } = await supabase.from("products").select("*", { count: "exact", head: true });
  console.log(`Existing products in DB: ${existingCount}`);

  // Process in parallel batches
  const BATCH_SIZE = 100;
  let inserted = 0;
  let skipped = 0;
  let imgInserted = 0;

  // Filter out products that might already exist (by slug)
  const toProcess: ProductRow[] = [];
  const seenSlugs = new Set<string>();

  for (const p of products) {
    const slug = slugify(p.name) + "-" + p.productCode.toLowerCase();
    if (seenSlugs.has(slug)) {
      skipped++;
      continue;
    }
    seenSlugs.add(slug);
    toProcess.push(p);
  }

  console.log(`Products to process: ${toProcess.length} (${skipped} duplicates filtered)`);
  skipped = 0;

  const batches: ProductRow[][] = [];
  for (let i = 0; i < toProcess.length; i += BATCH_SIZE) {
    batches.push(toProcess.slice(i, i + BATCH_SIZE));
  }
  console.log(`Batches: ${batches.length}\n`);

  const startTime = Date.now();

  for (let b = 0; b < batches.length; b++) {
    const batch = batches[b];
    const productRows: any[] = [];
    const imageRows: any[] = [];
    const catRows: any[] = [];

    for (const p of batch) {
      const productId = generateUUID();
      const slug = slugify(p.name) + "-" + p.productCode.toLowerCase();
      const status = validStatuses.includes(p.status) ? p.status : "OUT_OF_STOCK";
      const price = p.kandyamPrice > 0 ? p.kandyamPrice : p.listedPrice;
      const compareAt = p.compareAtPrice > 0 ? p.compareAtPrice : null;
      const qty = status === "OUT_OF_STOCK" ? 0 : p.stockQty > 0 ? p.stockQty : status === "PUBLISHED" ? 5 : 1;

      productRows.push({
        id: productId,
        vendor_id: vendor.id,
        title: p.name,
        slug,
        description: p.description || p.name,
        short_description: p.description ? p.description.slice(0, 200) : null,
        price,
        compare_at_price: compareAt,
        currency: "LKR",
        quantity: qty,
        status,
        sku: p.productCode,
        is_handmade: true,
        is_featured: false,
        shipping_price: p.deliveryCharge > 0 ? p.deliveryCharge : 400,
        views_count: p.views,
        sales_count: p.salesCount,
        review_count: p.reviews,
        average_rating: p.rating,
        published_at: status === "PUBLISHED" || status === "OUT_OF_STOCK" ? new Date().toISOString() : null,
      });

      // Category link
      const catId = catMap[p.category];
      if (catId) {
        catRows.push({ product_id: productId, category_id: catId });
      }

      // Image from existing CDN URLs
      if (p.cdnImageUrl && p.cdnImageUrl.startsWith("http")) {
        const imgId = generateUUID();
        imageRows.push({
          id: imgId,
          product_id: productId,
          url: p.cdnImageUrl,
          thumbnail: p.cdnImageUrl,
          medium: p.cdnImageUrl,
          large: p.cdnImageUrl,
          alt: p.name,
          sort_order: 0,
          is_primary: true,
        });
        imgInserted++;
      }

      // Alt CDN images (comma separated)
      if (p.altCdnImages && p.altCdnImages.startsWith("http")) {
        const altUrls = p.altCdnImages.split(",").filter((u) => u.trim().startsWith("http"));
        for (let ai = 0; ai < altUrls.length; ai++) {
          const imgId = generateUUID();
          imageRows.push({
            id: imgId,
            product_id: productId,
            url: altUrls[ai].trim(),
            thumbnail: altUrls[ai].trim(),
            medium: altUrls[ai].trim(),
            large: altUrls[ai].trim(),
            alt: `${p.name} ${ai + 1}`,
            sort_order: ai + 1,
            is_primary: false,
          });
          imgInserted++;
        }
      }
    }

    // Insert batch using parallel operations
    try {
      const { error: productErr } = await supabase.from("products").upsert(productRows, { onConflict: "slug" });
      if (productErr) {
        console.log(`  Batch ${b + 1}: Product error: ${productErr.message?.slice(0, 100)}`);
        continue;
      }
      inserted += productRows.length;

      if (catRows.length > 0) {
        await supabase.from("product_categories").upsert(catRows, { onConflict: "product_id,category_id" });
      }

      if (imageRows.length > 0) {
        // Insert images in smaller sub-batches
        for (let img = 0; img < imageRows.length; img += 500) {
          const imgBatch = imageRows.slice(img, img + 500);
          await supabase.from("product_images").upsert(imgBatch);
        }
      }
    } catch (err: any) {
      console.log(`  Batch ${b + 1}: Error: ${err.message?.slice(0, 100)}`);
      continue;
    }

    // Progress
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
    const pct = ((b + 1) / batches.length * 100).toFixed(1);
    console.log(`  Batch ${b + 1}/${batches.length} (${pct}%) | Products: ${inserted} | Images: ${imgInserted} | Elapsed: ${elapsed}s`);
  }

  // Verify
  const { count: finalCount } = await supabase.from("products").select("*", { count: "exact", head: true });
  const { count: imgCount } = await supabase.from("product_images").select("*", { count: "exact", head: true });

  console.log("\n======================================");
  console.log("  IMPORT COMPLETE!");
  console.log("======================================");
  console.log(`  Products inserted: ${inserted}`);
  console.log(`  Products in DB: ${finalCount}`);
  console.log(`  Images: ${imgCount}`);
  console.log(`  Skipped: ${skipped}`);
}

main().catch(console.error);
