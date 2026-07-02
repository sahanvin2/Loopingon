/**
 * Kandyam Supabase Setup Script
 * - Creates database tables
 * - Creates admin and customer users via Supabase Auth
 * - Reads Excel product data
 * - Uploads product images to B2
 * - Inserts products into Supabase
 *
 * Run: npx tsx scripts/setup-supabase.ts
 */

import { createClient } from "@supabase/supabase-js";
import { Pool } from "pg";
import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as crypto from "crypto";

// ========== CONFIGURATION ==========
const SUPABASE_URL = process.env.SUPABASE_URL || "https://lbrggticuwyqmdtllxsh.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "REMOVED_SECRET";
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || "sb_publishable_OMPVDw-0Yj5dhHMb4VFnjA_K6_GBPNi";

// Supabase DB connection (direct PostgreSQL)
const DB_HOST = process.env.DB_HOST || "db.lbrggticuwyqmdtllxsh.supabase.co";
const DB_PORT = parseInt(process.env.DB_PORT || "5432");
const DB_NAME = process.env.DB_NAME || "postgres";
const DB_USER = process.env.DB_USER || "postgres";
const DB_PASSWORD = process.env.DB_PASSWORD || "@20040301Sahan";

// B2 Storage
const B2_ENDPOINT = process.env.STORAGE_ENDPOINT || "https://s3.us-east-005.backblazeb2.com";
const B2_ACCESS_KEY = process.env.STORAGE_ACCESS_KEY || "0053aaa597862ee0000000001";
const B2_SECRET_KEY = process.env.STORAGE_SECRET_KEY || "K005kVHvMmLD696fVPINAqzU2wW+HGs";
const B2_BUCKET = process.env.STORAGE_BUCKET || "movia-prod";
const CDN_URL = process.env.CDN_URL || "https://kandyam.b-cdn.net";

// Paths
const EXCEL_FILE = process.env.EXCEL_FILE || "D:\\Mern\\Loopingon\\loopingon\\Assets\\kandyam_products.xlsx";
const IMAGES_BASE = process.env.IMAGES_BASE || "D:\\Python\\Data scrap\\product_images\\With text file\\product_images";
const SCHEMA_FILE = process.env.SCHEMA_FILE || path.join(__dirname, "supabase-schema.sql");

// Users
const ADMIN_EMAIL = "sahannawarathne2004@gmail.com";
const ADMIN_PASSWORD = "@20040301Sa";
const CUSTOMER_EMAIL = "sahannawarathne271@gmail.com";
const CUSTOMER_PASSWORD = "@20040301Sahan";

// ========== INITIALIZATION ==========
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const pgPool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
  max: 5,
});

const s3 = new S3Client({
  endpoint: B2_ENDPOINT,
  region: "us-east-005",
  credentials: {
    accessKeyId: B2_ACCESS_KEY,
    secretAccessKey: B2_SECRET_KEY,
  },
  forcePathStyle: true,
});

// ========== UTILITIES ==========
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

function generateUUID(): string {
  return crypto.randomUUID();
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function execSQL(sql: string): Promise<void> {
  const client = await pgPool.connect();
  try {
    await client.query(sql);
  } finally {
    client.release();
  }
}

// ========== STEP 1: RUN SCHEMA ==========
async function setupDatabase() {
  console.log("=== STEP 1: Setting up database schema ===");
  const schema = fs.readFileSync(SCHEMA_FILE, "utf-8");
  // Split by semicolons but handle DO blocks
  const statements = schema
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const stmt of statements) {
    try {
      await execSQL(stmt + ";");
    } catch (err: any) {
      if (err.message && err.message.includes("already exists")) {
        // Skip duplicate errors
      } else if (err.message && err.message.includes("duplicate_object")) {
        // Skip
      } else {
        console.warn(`  SQL warning: ${err.message?.slice(0, 100)}`);
      }
    }
  }
  console.log("  Database schema created successfully");
}

// State
let allAuthUsers: any[] = [];

// ========== STEP 2: CREATE USERS ==========
async function createUsers() {
  console.log("=== STEP 2: Creating users ===");

  // Fetch all existing users
  let page = 1;
  while (true) {
    const { data } = await supabase.auth.admin.listUsers({ perPage: 100, page });
    if (!data?.users || data.users.length === 0) break;
    allAuthUsers.push(...data.users);
    if (data.users.length < 100) break;
    page++;
  }
  const adminExists = allAuthUsers.find((u: any) => u.email === ADMIN_EMAIL);

  if (!adminExists) {
    const { data: admin, error } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: {
        full_name: "Sahan Nawarathne",
        first_name: "Sahan",
        last_name: "Nawarathne",
        role: "SUPER_ADMIN",
      },
    });
    if (error) {
      console.error(`  Failed to create admin: ${error.message}`);
    } else {
      console.log(`  Admin created: ${admin.user?.id}`);
      // Insert into profiles
      await supabase.from("profiles").upsert({
        id: admin.user!.id,
        email: ADMIN_EMAIL,
        full_name: "Sahan Nawarathne",
        first_name: "Sahan",
        last_name: "Nawarathne",
        role: "SUPER_ADMIN",
        email_verified: true,
        email_verified_at: new Date().toISOString(),
      });
    }
  } else {
    console.log(`  Admin already exists: ${(adminExists as any)?.id || "yes"}`);
  }

  // Check if customer exists
  const customerExists = allAuthUsers.find((u: any) => u.email === CUSTOMER_EMAIL);
  if (!customerExists) {
    const { data: customer, error } = await supabase.auth.admin.createUser({
      email: CUSTOMER_EMAIL,
      password: CUSTOMER_PASSWORD,
      email_confirm: true,
      user_metadata: {
        full_name: "Sahan Nawarathne",
        first_name: "Sahan",
        last_name: "Nawarathne",
        role: "CUSTOMER",
      },
    });
    if (error) {
      console.error(`  Failed to create customer: ${error.message}`);
    } else {
      console.log(`  Customer created: ${customer.user?.id}`);
      await supabase.from("profiles").upsert({
        id: customer.user!.id,
        email: CUSTOMER_EMAIL,
        full_name: "Sahan Nawarathne",
        first_name: "Sahan",
        last_name: "Nawarathne",
        role: "CUSTOMER",
        email_verified: true,
        email_verified_at: new Date().toISOString(),
      });
      // Create customer profile
      await supabase.from("customer_profiles").upsert({
        user_id: customer.user!.id,
        preferred_language: "en",
        currency: "LKR",
      });
    }
  } else {
    console.log(`  Customer already exists`);
  }

  console.log("  Users setup complete");
}

// ========== STEP 3: CREATE VENDOR ==========
async function createVendor() {
  console.log("=== STEP 3: Creating vendor ===");

  const adminUser = allAuthUsers.find((u: any) => u.email === ADMIN_EMAIL);
  if (!adminUser) {
    console.log("  Admin user not found, skipping vendor creation");
    return null;
  }

  const vendorId = generateUUID();

  // Check if vendor already exists
  const { data: existing } = await supabase
    .from("vendors")
    .select("id")
    .eq("store_slug", "kandyam")
    .single();

  if (existing) {
    console.log(`  Vendor already exists: ${existing.id}`);
    return existing.id;
  }

  // Update admin profile to VENDOR role
  await supabase
    .from("profiles")
    .update({ role: "SUPER_ADMIN" })
    .eq("id", adminUser.id);

  const { error } = await supabase.from("vendors").insert({
    id: vendorId,
    user_id: adminUser.id,
    store_name: "Kandyam",
    store_slug: "kandyam",
    store_description:
      "Kandyam - Where Sri Lankan Craft Meets the World. Discover authentic handmade crafts, traditional art, and unique products from skilled artisans across Sri Lanka.",
    status: "VERIFIED",
    verified_at: new Date().toISOString(),
    business_name: "Kandyam (Pvt) Ltd",
    craft_type: ["Handicrafts", "Home Decor", "Jewelry", "Textiles", "Wood Carvings"],
    workshop_location: "Kandy",
    workshop_city: "Kandy",
    workshop_district: "Kandy",
    free_shipping_enabled: false,
    commission_rate: 20.0,
  });

  if (error) {
    console.error(`  Failed to create vendor: ${error.message}`);
    return null;
  }

  console.log(`  Vendor created: ${vendorId}`);
  return vendorId;
}

// ========== STEP 4: PROCESS EXCEL ==========
interface ProductRow {
  row: number;
  productCode: string;
  proId: string;
  name: string;
  category: string;
  price: number;
  listedPrice: number;
  compareAtPrice: number;
  kandyamPrice: number;
  seller: string;
  deliveryCharge: number;
  status: string;
  stockQty: number;
  description: string;
  totalImages: number;
  cdnImageUrl: string;
  altCdnImages: string;
  a2zImageUrl: string;
  localImage: string;
  bestImage: string;
  productLink: string;
}

function readExcel(): ProductRow[] {
  console.log("=== Reading Excel file ===");
  const workbook = XLSX.readFile(EXCEL_FILE);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rawData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  console.log(`  Total rows in Excel: ${rawData.length}`);

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
      price: parseFloat(priceStr) || 0,
      listedPrice: parseFloat(String(row[6] || "0").replace(/[^0-9.]/g, "")) || 0,
      compareAtPrice: parseFloat(compareStr) || 0,
      kandyamPrice: parseFloat(kandyamStr) || 0,
      seller: String(row[10] || "Kandyam").trim(),
      deliveryCharge: parseInt(String(row[11] || "0").replace(/[^0-9]/g, "")) || 0,
      status: String(row[12] || "DRAFT").trim().toUpperCase().replace(/ /g, "_"),
      stockQty: parseInt(String(row[13] || "0").replace(/[^0-9]/g, "")) || 0,
      description: String(row[28] || "").trim(),
      totalImages: parseInt(String(row[29] || "0")) || 0,
      cdnImageUrl: String(row[30] || "").trim(),
      altCdnImages: String(row[31] || "").trim(),
      a2zImageUrl: String(row[32] || "").trim(),
      localImage: String(row[33] || "").trim(),
      bestImage: String(row[34] || "").trim(),
      productLink: String(row[36] || "").trim(),
    });
  }
  console.log(`  Parsed products: ${products.length}`);
  return products;
}

// ========== STEP 5: CATEGORIES ==========
async function insertCategories(products: ProductRow[]) {
  console.log("=== STEP 5: Inserting categories ===");

  const categories = products
    .map((p) => p.category)
    .filter((c, i, arr) => c && arr.indexOf(c) === i)
    .sort();

  const categoryMap: Record<string, string> = {};

  for (const cat of categories) {
    const slug = slugify(cat);
    const { data: existing } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .single();

    if (existing) {
      categoryMap[cat] = existing.id;
    } else {
      const id = generateUUID();
      const { error } = await supabase.from("categories").insert({
        id,
        name: cat,
        slug,
        is_active: true,
        level: 0,
      });
      if (error) {
        console.error(`  Failed to insert category ${cat}: ${error.message}`);
      } else {
        categoryMap[cat] = id;
      }
    }
  }

  console.log(`  Categories: ${Object.keys(categoryMap).length}`);
  return categoryMap;
}

// ========== STEP 6: UPLOAD IMAGES TO B2 ==========
async function uploadImageToB2(
  localPath: string,
  remoteKey: string
): Promise<string | null> {
  if (!fs.existsSync(localPath)) return null;

  const fileBuffer = fs.readFileSync(localPath);
  const ext = path.extname(localPath).toLowerCase();
  const contentType =
    ext === ".png"
      ? "image/png"
      : ext === ".webp"
        ? "image/webp"
        : ext === ".gif"
          ? "image/gif"
          : "image/jpeg";

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: B2_BUCKET,
        Key: remoteKey,
        Body: fileBuffer,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      })
    );
    return `${CDN_URL}/${remoteKey}`;
  } catch (err: any) {
    console.warn(`  Upload failed for ${localPath}: ${err.message?.slice(0, 80)}`);
    return null;
  }
}

function findProductImages(productName: string): string[] {
  const images: string[] = [];
  const productDir = path.join(IMAGES_BASE, productName);

  if (!fs.existsSync(productDir)) return images;

  const files = fs.readdirSync(productDir);
  for (const file of files) {
    const ext = file.toLowerCase();
    if (
      ext.endsWith(".jpg") ||
      ext.endsWith(".jpeg") ||
      ext.endsWith(".png") ||
      ext.endsWith(".webp")
    ) {
      images.push(path.join(productDir, file));
    }
  }

  // If no images in subfolder, check for flat files matching product name
  if (images.length === 0) {
    const allDirs = fs
      .readdirSync(IMAGES_BASE, { withFileTypes: true })
      .filter((d) => d.isDirectory());

    for (const dir of allDirs) {
      if (dir.name.includes(productName) || productName.includes(dir.name)) {
        const dirFiles = fs.readdirSync(path.join(IMAGES_BASE, dir.name));
        for (const f of dirFiles) {
          const ext = f.toLowerCase();
          if (
            ext.endsWith(".jpg") ||
            ext.endsWith(".jpeg") ||
            ext.endsWith(".png") ||
            ext.endsWith(".webp")
          ) {
            images.push(path.join(IMAGES_BASE, dir.name, f));
          }
        }
        if (images.length > 0) break;
      }
    }
  }

  return images;
}

// ========== STEP 7: INSERT PRODUCTS ==========
async function insertProducts(
  products: ProductRow[],
  vendorId: string,
  categoryMap: Record<string, string>
) {
  console.log("=== STEP 7: Inserting products ===");
  console.log(`  Total: ${products.length}`);

  const validStatuses = [
    "DRAFT",
    "PENDING_REVIEW",
    "PUBLISHED",
    "REJECTED",
    "OUT_OF_STOCK",
    "DISCONTINUED",
    "FLAGGED",
  ];

  let inserted = 0;
  let skipped = 0;
  let imageUploaded = 0;

  // Process in batches of 50
  const BATCH_SIZE = 50;
  const batches: ProductRow[][] = [];
  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    batches.push(products.slice(i, i + BATCH_SIZE));
  }

  for (let b = 0; b < batches.length; b++) {
    const batch = batches[b];
    console.log(`  Batch ${b + 1}/${batches.length} (${batch.length} products)`);

    for (const p of batch) {
      const productId = generateUUID();
      const slug = slugify(p.name) + "-" + p.productCode.toLowerCase();
      const status = validStatuses.includes(p.status)
        ? p.status
        : "OUT_OF_STOCK";

      const price = p.kandyamPrice > 0 ? p.kandyamPrice : p.price;
      const compareAt = p.compareAtPrice > 0 ? p.compareAtPrice : null;
      const qty =
        status === "OUT_OF_STOCK"
          ? 0
          : p.stockQty > 0
            ? p.stockQty
            : status === "PUBLISHED"
              ? 5
              : 1;

      const categoryId = categoryMap[p.category];

      try {
        // Insert product
        const { error: productError } = await supabase.from("products").insert({
          id: productId,
          vendor_id: vendorId,
          title: p.name,
          slug,
          description: p.description || p.name,
          short_description: p.description
            ? p.description.slice(0, 200)
            : null,
          price,
          compare_at_price: compareAt,
          currency: "LKR",
          quantity: qty,
          status,
          sku: p.productCode,
          is_handmade: true,
          is_featured: false,
          shipping_price: p.deliveryCharge > 0 ? p.deliveryCharge : 400,
          published_at:
            status === "PUBLISHED" || status === "OUT_OF_STOCK"
              ? new Date().toISOString()
              : null,
        });

        if (productError) {
          if (
            productError.message?.includes("duplicate") ||
            productError.code === "23505"
          ) {
            skipped++;
            continue;
          }
          console.warn(`  Product error [${p.productCode}]: ${productError.message?.slice(0, 100)}`);
          skipped++;
          continue;
        }

        // Link category
        if (categoryId) {
          await supabase.from("product_categories").upsert({
            product_id: productId,
            category_id: categoryId,
          });
        }

        // Handle images
        // 1. Try CDN image from Excel if valid
        let primaryImageUrl = "";
        let imageIndex = 0;

        if (p.cdnImageUrl && p.cdnImageUrl.startsWith("http")) {
          const imgId = generateUUID();
          primaryImageUrl = p.cdnImageUrl;
          await supabase.from("product_images").insert({
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
          imageIndex++;
        }

        // 2. Upload local images to B2
        const localImages = findProductImages(p.name);

        if (localImages.length > 0) {
          for (let idx = 0; idx < Math.min(localImages.length, 5); idx++) {
            const imgPath = localImages[idx];
            const ext = path.extname(imgPath) || ".jpg";
            const remoteKey = `products/${p.productCode}/${p.productCode}_${idx + 1}${ext}`;

            const cdnUrl = await uploadImageToB2(imgPath, remoteKey);
            if (cdnUrl) {
              imageUploaded++;
              if (!primaryImageUrl) primaryImageUrl = cdnUrl;

              const imgId = generateUUID();
              await supabase.from("product_images").insert({
                id: imgId,
                product_id: productId,
                url: cdnUrl,
                thumbnail: cdnUrl,
                medium: cdnUrl,
                large: cdnUrl,
                alt: p.name,
                sort_order: imageIndex,
                is_primary: imageIndex === 0,
              });
              imageIndex++;
            }
          }
        }

        // 3. Fallback: Use the bestImage path or localImage path
        if (imageIndex === 0 && (p.bestImage || p.localImage)) {
          const localPath = p.bestImage || p.localImage;
          if (localPath && fs.existsSync(localPath)) {
            const ext = path.extname(localPath) || ".jpg";
            const remoteKey = `products/${p.productCode}/${p.productCode}_1${ext}`;
            const cdnUrl = await uploadImageToB2(localPath, remoteKey);
            if (cdnUrl) {
              imageUploaded++;
              const imgId = generateUUID();
              await supabase.from("product_images").insert({
                id: imgId,
                product_id: productId,
                url: cdnUrl,
                thumbnail: cdnUrl,
                medium: cdnUrl,
                large: cdnUrl,
                alt: p.name,
                sort_order: 0,
                is_primary: true,
              });
              imageIndex++;
            }
          }
        }

        inserted++;
      } catch (err: any) {
        console.warn(`  Error [${p.productCode}]: ${err.message?.slice(0, 100)}`);
        skipped++;
      }
    }

    // Small delay between batches
    if (b < batches.length - 1) {
      await sleep(500);
    }
  }

  console.log(`  Inserted: ${inserted}, Skipped: ${skipped}, Images uploaded: ${imageUploaded}`);
  return { inserted, skipped, imageUploaded };
}

// ========== STEP 8: VERIFY ==========
async function verify() {
  console.log("=== STEP 8: Verification ===");

  const { count: productCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  const { count: categoryCount } = await supabase
    .from("categories")
    .select("*", { count: "exact", head: true });

  const { count: imageCount } = await supabase
    .from("product_images")
    .select("*", { count: "exact", head: true });

  const { count: vendorCount } = await supabase
    .from("vendors")
    .select("*", { count: "exact", head: true });

  const { data: authUsers } = await supabase.auth.admin.listUsers();

  console.log(`  Auth Users: ${authUsers?.users?.length || 0}`);
  console.log(`  Categories: ${categoryCount || 0}`);
  console.log(`  Vendors: ${vendorCount || 0}`);
  console.log(`  Products: ${productCount || 0}`);
  console.log(`  Product Images: ${imageCount || 0}`);
}

// ========== MAIN ==========
async function main() {
  console.log("======================================");
  console.log("  Kandyam Supabase Setup");
  console.log("======================================");
  console.log(`  Supabase URL: ${SUPABASE_URL}`);
  console.log(`  DB Host: ${DB_HOST}:${DB_PORT}`);
  console.log(`  CDN: ${CDN_URL}`);
  console.log("======================================\n");

  try {
    console.log("=== STEP 1: Skipping schema (already applied via run-schema.js) ===");
    await createUsers();
    const vendorId = await createVendor();
    if (!vendorId) {
      console.error("ERROR: No vendor created. Exiting.");
      process.exit(1);
    }

    const products = readExcel();
    const categoryMap = await insertCategories(products);
    await insertProducts(products, vendorId, categoryMap);
    await verify();

    console.log("\n======================================");
    console.log("  SETUP COMPLETE!");
    console.log("======================================");
    console.log(`\nAdmin login: ${ADMIN_EMAIL}`);
    console.log(`Customer login: ${CUSTOMER_EMAIL}`);
  } catch (err: any) {
    console.error("FATAL ERROR:", err.message);
    console.error(err.stack);
  } finally {
    await pgPool.end();
  }
}

main();
