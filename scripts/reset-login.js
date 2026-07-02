const { Pool } = require("pg");
const pool = new Pool({
  connectionString: "postgresql://postgres:@20040301Sahan@db.lbrggticuwyqmdtllxsh.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false },
});
async function fix() {
  const pg = await pool.connect();
  try {
    await pg.query('UPDATE public.users SET "failedLoginAttempts" = 0, "lockedUntil" = NULL');
    const { rows } = await pg.query('SELECT email, "failedLoginAttempts", "lockedUntil" FROM public.users');
    for (const u of rows) {
      console.log(`  ${u.email} | attempts: ${u.failedLoginAttempts} | locked: ${u.lockedUntil || "no"}`);
    }
    console.log("Reset complete");
  } finally { pg.release(); pool.end(); }
}
fix();
