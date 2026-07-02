// Rename PostgreSQL ENUM types to match Prisma schema (camelCase)
const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgresql://postgres:@20040301Sahan@db.lbrggticuwyqmdtllxsh.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false },
});

const TYPE_RENAMES = {
  user_role: "UserRole",
  vendor_status: "VendorStatus",
  product_status: "ProductStatus",
  order_status: "OrderStatus",
  payment_status: "PaymentStatus",
  payout_status: "PayoutStatus",
  discount_type: "DiscountType",
};

async function renameTypes() {
  const client = await pool.connect();
  try {
    for (const [oldName, newName] of Object.entries(TYPE_RENAMES)) {
      try {
        await client.query(`ALTER TYPE ${oldName} RENAME TO "${newName}"`);
        console.log(`  Renamed: ${oldName} -> ${newName}`);
      } catch (e) {
        console.log(`  Skip: ${oldName} - ${e.message.slice(0, 80)}`);
      }
    }
    console.log("\nType renames complete");
  } finally {
    client.release();
    pool.end();
  }
}

renameTypes();
