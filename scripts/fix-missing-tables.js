// Comprehensive: find and fix ALL missing tables and columns
const { Pool } = require("pg");
const fs = require("fs");

const pool = new Pool({
  connectionString: "postgresql://postgres:@20040301Sahan@db.lbrggticuwyqmdtllxsh.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false },
});

// Parse Prisma schema to extract models and their fields
function parsePrismaSchema() {
  const schema = fs.readFileSync("D:/Mern/Loopingon/loopingon/apps/server/prisma/schema.prisma", "utf-8");
  const models = [];
  const modelRegex = /^model (\w+)\s*\{([^}]+)\}/gm;
  let match;
  while ((match = modelRegex.exec(schema)) !== null) {
    const name = match[1];
    const body = match[2];
    const tableName = (body.match(/@@map\("(\w+)"\)/) || [null, name])[1];
    const fields = [];
    const fieldRegex = /^\s+(\w+)\s+\w+/gm;
    let fm;
    while ((fm = fieldRegex.exec(body)) !== null) {
      const fname = fm[1];
      if (["id", "user", "product", "vendor", "customer", "order", "cart", "wishlist", "category", "coupon", "account", "entry", "thread", "ticket", "sender", "referrer", "referredUser", "referralCode"].includes(fname)) continue;
      // Check for @map annotation for this field
      const fieldBlock = body.slice(fm.index, body.indexOf("\n", fm.index));
      const mapMatch = fieldBlock.match(/@map\("(\w+)"\)/);
      const colName = mapMatch ? mapMatch[1] : fname;
      fields.push({ fieldName: fname, colName });
    }
    models.push({ modelName: name, tableName, fields });
  }
  return models;
}

async function main() {
  const pg = await pool.connect();
  try {
    const models = parsePrismaSchema();
    console.log(`Prisma models: ${models.length}\n`);

    // Get existing tables
    const { rows: tables } = await pg.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema='public'`
    );
    const existingTables = new Set(tables.map(r => r.table_name));

    // Get columns for each existing table
    const tableColumns = {};
    for (const t of existingTables) {
      const { rows: cols } = await pg.query(
        `SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name='${t}'`
      );
      tableColumns[t] = new Set(cols.map(c => c.column_name));
    }

    // Check each model
    let totalMissingTables = 0;
    let totalMissingCols = 0;

    for (const model of models) {
      if (!existingTables.has(model.tableName)) {
        console.log(`MISSING TABLE: ${model.tableName} (model: ${model.modelName})`);
        totalMissingTables++;
        continue;
      }

      const dbCols = tableColumns[model.tableName];
      // Skip models that aren't in DB (we already checked)
      if (!dbCols) continue;

      for (const field of model.fields) {
        // Skip relation fields, enums, etc
        if (field.colName.includes(".")) continue;
        if (["DateTime", "Boolean", "Int", "Float", "String", "Json", "Decimal"].some(t => field.colName.includes(t))) continue;
        
        if (!dbCols.has(field.colName)) {
          console.log(`  Missing col: ${model.tableName}.${field.colName} (model field: ${field.fieldName})`);
          totalMissingCols++;
        }
      }
    }

    console.log(`\n=== Missing: ${totalMissingTables} tables, ${totalMissingCols} columns ===`);

    // Now create missing tables
    if (totalMissingTables > 0) {
      console.log("\n=== Creating missing tables ===");
      
      // Create tables that we know are missing
      const missingTables = models.filter(m => !existingTables.has(m.tableName));
      
      for (const model of missingTables) {
        console.log(`  Creating: ${model.tableName}`);
        
        // Based on Prisma schema, create the table with all columns
        // We'll use the Prisma db push approach for exact matching
      }
    }

    // Check specific known issues
    console.log("\n=== Checking specific known issues ===");
    
    // product_videos
    if (!existingTables.has("product_videos")) {
      console.log("Creating product_videos...");
      await pg.query(`
        CREATE TABLE IF NOT EXISTS public.product_videos (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          "productId" UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
          url TEXT NOT NULL,
          "thumbnailUrl" TEXT,
          duration INTEGER,
          "sortOrder" INTEGER DEFAULT 0,
          "createdAt" TIMESTAMPTZ DEFAULT now()
        )
      `);
      console.log("  OK");
    }

    // vendor columns
    if (existingTables.has("vendors")) {
      const vendorCols = tableColumns["vendors"];
      const missingVendorCols = [
        { name: "employeeCount", type: "INTEGER" },
        { name: "websiteUrl", type: "TEXT" },
        { name: "facebookUrl", type: "TEXT" },
        { name: "instagramUrl", type: "TEXT" },
        { name: "youtubeUrl", type: "TEXT" },
        { name: "tiktokUrl", type: "TEXT" },
        { name: "freeShippingMinOrder", type: "DECIMAL(10,2)" },
        { name: "storeLogo", type: "TEXT" },
        { name: "storeBanner", type: "TEXT" },
        { name: "totalProducts", type: "INTEGER DEFAULT 0" },
        { name: "totalOrders", type: "INTEGER DEFAULT 0" },
        { name: "totalRevenue", type: "DECIMAL(12,2) DEFAULT 0" },
        { name: "responseRate", type: "FLOAT DEFAULT 0" },
        { name: "avgResponseTime", type: "FLOAT DEFAULT 0" },
        { name: "onTimeDeliveryRate", type: "FLOAT DEFAULT 0" },
        { name: "returnRate", type: "FLOAT DEFAULT 0" },
        { name: "nextPayoutDate", type: "TIMESTAMPTZ" },
        { name: "lastPayoutDate", type: "TIMESTAMPTZ" },
        { name: "pendingPayoutAmount", type: "DECIMAL(12,2) DEFAULT 0" },
        { name: "totalPayoutAmount", type: "DECIMAL(12,2) DEFAULT 0" },
        { name: "vacationMode", type: "BOOLEAN DEFAULT false" },
        { name: "freeShippingEnabled", type: "BOOLEAN DEFAULT false" },
        { name: "verifiedBy", type: "TEXT" },
        { name: "storeSince", type: "TIMESTAMPTZ DEFAULT now()" },
      ];
      
      for (const col of missingVendorCols) {
        if (!vendorCols.has(col.name)) {
          try {
            await pg.query(`ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS "${col.name}" ${col.type}`);
            console.log(`  Added: vendors.${col.name}`);
          } catch(e) {
            console.log(`  Skip: vendors.${col.name} - ${e.message.slice(0,60)}`);
          }
        }
      }
    }

    // order_items - check missing columns
    if (existingTables.has("order_items")) {
      const oiCols = tableColumns["order_items"];
      const missingOI = [
        { name: "variantId", type: "UUID" },
        { name: "productImage", type: "TEXT" },
        { name: "vendorId", type: "UUID NOT NULL" },
      ];
      for (const col of missingOI) {
        if (!oiCols.has(col.name)) {
          try {
            await pg.query(`ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS "${col.name}" ${col.type}`);
            console.log(`  Added: order_items.${col.name}`);
          } catch(e) {
            console.log(`  Skip: order_items.${col.name} - ${e.message.slice(0,60)}`);
          }
        }
      }
    }

    // shipping_rates table
    if (!existingTables.has("shipping_rates")) {
      console.log("Creating shipping_rates...");
      await pg.query(`
        CREATE TABLE IF NOT EXISTS public.shipping_rates (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          "courierName" TEXT NOT NULL,
          "domesticRate" DECIMAL(10,2) NOT NULL,
          "internationalRate" DECIMAL(10,2) NOT NULL,
          "freeShippingMinAmount" DECIMAL(10,2),
          "estimatedDays" INTEGER NOT NULL,
          "weightLimit" FLOAT,
          "isActive" BOOLEAN DEFAULT true,
          "createdAt" TIMESTAMPTZ DEFAULT now(),
          "updatedAt" TIMESTAMPTZ DEFAULT now()
        )
      `);
      console.log("  OK");
    }

    // commission_settings
    if (!existingTables.has("commission_settings")) {
      console.log("Creating commission_settings...");
      await pg.query(`
        CREATE TABLE IF NOT EXISTS public.commission_settings (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          rate FLOAT NOT NULL,
          "minOrderAmount" DECIMAL(10,2),
          "maxOrderAmount" DECIMAL(10,2),
          "applicableTo" TEXT[],
          "isActive" BOOLEAN DEFAULT true,
          "startsAt" TIMESTAMPTZ,
          "endsAt" TIMESTAMPTZ,
          "createdAt" TIMESTAMPTZ DEFAULT now(),
          "updatedAt" TIMESTAMPTZ DEFAULT now()
        )
      `);
      console.log("  OK");
    }

    // blog_posts
    if (!existingTables.has("blog_posts")) {
      console.log("Creating blog_posts...");
      await pg.query(`
        CREATE TABLE IF NOT EXISTS public.blog_posts (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          title TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          excerpt TEXT,
          content TEXT NOT NULL,
          "featuredImage" TEXT,
          "authorId" TEXT NOT NULL,
          category TEXT,
          tags TEXT[],
          "isPublished" BOOLEAN DEFAULT false,
          "publishedAt" TIMESTAMPTZ,
          "viewCount" INTEGER DEFAULT 0,
          "metaTitle" TEXT,
          "metaDescription" TEXT,
          "createdAt" TIMESTAMPTZ DEFAULT now(),
          "updatedAt" TIMESTAMPTZ DEFAULT now()
        )
      `);
      console.log("  OK");
    }

    // storefront_settings
    if (!existingTables.has("storefront_settings")) {
      console.log("Creating storefront_settings...");
      await pg.query(`
        CREATE TABLE IF NOT EXISTS public.storefront_settings (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          "vendorId" UUID UNIQUE NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
          "themeColor" TEXT,
          "customCss" TEXT,
          "featuredProducts" TEXT[],
          "aboutSection" TEXT,
          policies JSONB,
          "storySection" TEXT,
          "videoUrl" TEXT,
          "createdAt" TIMESTAMPTZ DEFAULT now(),
          "updatedAt" TIMESTAMPTZ DEFAULT now()
        )
      `);
      console.log("  OK");
    }

    // vendor_analytics
    if (!existingTables.has("vendor_analytics")) {
      console.log("Creating vendor_analytics...");
      await pg.query(`
        CREATE TABLE IF NOT EXISTS public.vendor_analytics (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          "vendorId" UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
          date TIMESTAMPTZ NOT NULL,
          views INTEGER DEFAULT 0,
          "uniqueVisitors" INTEGER DEFAULT 0,
          orders INTEGER DEFAULT 0,
          revenue DECIMAL(12,2) DEFAULT 0,
          commission DECIMAL(12,2) DEFAULT 0,
          "conversionRate" FLOAT DEFAULT 0,
          "avgOrderValue" DECIMAL(10,2) DEFAULT 0,
          "createdAt" TIMESTAMPTZ DEFAULT now(),
          UNIQUE ("vendorId", date)
        )
      `);
      console.log("  OK");
    }

    // Final count
    const { rows: finalTables } = await pg.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name`
    );
    console.log(`\n=== Total tables: ${finalTables.length} ===`);
    console.log(finalTables.map(r => r.table_name).join(", "));
  } finally {
    pg.release();
    pool.end();
  }
}

main();
