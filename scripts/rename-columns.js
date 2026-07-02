// Rename all snake_case columns to camelCase in Supabase
const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgresql://postgres:@20040301Sahan@db.lbrggticuwyqmdtllxsh.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false },
});

function toCamel(s) {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

async function fix() {
  const client = await pool.connect();
  try {
    // Get all columns with underscore
    const { rows: cols } = await client.query(
      `SELECT table_name, column_name FROM information_schema.columns WHERE table_schema = 'public' AND column_name LIKE '%\_%'`
    );

    console.log(`Columns to rename: ${cols.length}`);

    let ok = 0;
    let skip = 0;

    for (const col of cols) {
      const camel = toCamel(col.column_name);
      if (camel !== col.column_name) {
        try {
          await client.query(
            `ALTER TABLE public."${col.table_name}" RENAME COLUMN "${col.column_name}" TO "${camel}"`
          );
          ok++;
        } catch (e) {
          console.log(
            `  Skip: ${col.table_name}.${col.column_name} -> ${camel} | ${e.message.slice(0, 80)}`
          );
          skip++;
        }
      }
    }

    console.log(`\nDone: ${ok} renamed, ${skip} skipped`);
  } finally {
    client.release();
    pool.end();
  }
}

fix();
