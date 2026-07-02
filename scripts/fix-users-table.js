// Fix: rename profiles→users, add passwordHash, set passwords
const { Pool } = require("pg");
const argon2 = require("argon2");

const pool = new Pool({
  connectionString: "postgresql://postgres:@20040301Sahan@db.lbrggticuwyqmdtllxsh.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false },
});

async function fix() {
  const pg = await pool.connect();
  try {
    // 1. Check if users table exists
    const { rows: [r] } = await pg.query(
      `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema='public' AND table_name='users') as ex`
    );
    
    if (r.ex) {
      console.log("users table already exists, skipping rename");
    } else {
      console.log("Renaming profiles → users...");
      await pg.query('ALTER TABLE public.profiles RENAME TO users');
      console.log("  Done");
    }

    // 2. Add missing columns
    const cols = [
      'ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "passwordHash" TEXT',
      'ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "twoFactorEnabled" BOOLEAN DEFAULT false',
      'ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "twoFactorSecret" TEXT',
      'ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "twoFactorBackupCodes" TEXT[]',
    ];
    for (const sql of cols) {
      try { await pg.query(sql); console.log("  Added column OK"); } 
      catch (e) { console.log("  Column skip:", e.message.slice(0, 60)); }
    }

    // 3. Set argon2 password hashes
    const adminHash = await argon2.hash("@20040301Sa");
    const customerHash = await argon2.hash("@20040301Sahan");

    await pg.query(
      `UPDATE public.users SET "passwordHash" = '${adminHash}' WHERE email = 'sahannawarathne2004@gmail.com'`
    );
    console.log("Admin password set");

    await pg.query(
      `UPDATE public.users SET "passwordHash" = '${customerHash}' WHERE email = 'sahannawarathne271@gmail.com'`
    );
    console.log("Customer password set");

    // 4. Verify
    const { rows: users } = await pg.query(
      'SELECT email, "passwordHash" IS NOT NULL as has_pw, role FROM public.users'
    );
    console.log("\nUsers:");
    for (const u of users) {
      console.log(`  ${u.email} | hasPW: ${u.has_pw} | role: ${u.role}`);
    }

    // 5. Check if foreign keys need updating (they reference by id, not table name, so should be fine)
    // But we need to check if any FK constraint references profiles
    const { rows: fks } = await pg.query(`
      SELECT conname FROM pg_constraint 
      WHERE confrelid = 'public.users'::regclass OR conrelid = 'public.users'::regclass 
      LIMIT 5
    `);

    console.log("\n=== DONE ===");
  } finally {
    pg.release();
    pool.end();
  }
}

fix();
