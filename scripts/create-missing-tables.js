// Create missing tables needed by auth flow
const { Pool } = require("pg");
const pool = new Pool({
  connectionString: "postgresql://postgres:@20040301Sahan@db.lbrggticuwyqmdtllxsh.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false },
});

const TABLES = [
  `CREATE TABLE IF NOT EXISTS public.refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    family TEXT NOT NULL,
    "revokedAt" TIMESTAMPTZ,
    "expiresAt" TIMESTAMPTZ NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS idx_rt_user ON public.refresh_tokens("userId")`,
  `CREATE INDEX IF NOT EXISTS idx_rt_token ON public.refresh_tokens(token)`,
  `CREATE INDEX IF NOT EXISTS idx_rt_family ON public.refresh_tokens(family)`,

  `CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "deviceInfo" JSONB,
    "expiresAt" TIMESTAMPTZ NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS idx_sess_user ON public.sessions("userId")`,
  `CREATE INDEX IF NOT EXISTS idx_sess_token ON public.sessions(token)`,

  `CREATE TABLE IF NOT EXISTS public.pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "isPublished" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMPTZ DEFAULT now(),
    "updatedAt" TIMESTAMPTZ DEFAULT now()
  )`,

  `CREATE TABLE IF NOT EXISTS public.seo_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    keywords TEXT[],
    "ogImage" TEXT,
    "canonicalUrl" TEXT,
    "structuredData" JSONB,
    "createdAt" TIMESTAMPTZ DEFAULT now(),
    "updatedAt" TIMESTAMPTZ DEFAULT now()
  )`,

  `CREATE TABLE IF NOT EXISTS public.sitemap_urls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url TEXT UNIQUE NOT NULL,
    changefreq TEXT DEFAULT 'weekly',
    priority FLOAT DEFAULT 0.5,
    lastmod TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ DEFAULT now()
  )`,

  `CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID REFERENCES public.users(id),
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    "entityId" TEXT,
    "oldValue" JSONB,
    "newValue" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    metadata JSONB,
    "createdAt" TIMESTAMPTZ DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS idx_audit_user ON public.audit_logs("userId")`,
  `CREATE INDEX IF NOT EXISTS idx_audit_action ON public.audit_logs(action)`,
  `CREATE INDEX IF NOT EXISTS idx_audit_entity ON public.audit_logs(entity, "entityId")`,
];

async function run() {
  const pg = await pool.connect();
  try {
    for (const sql of TABLES) {
      try {
        await pg.query(sql);
        console.log("  OK:", sql.slice(0, 80).replace(/\n/g, " "));
      } catch (e) {
        console.log("  Skip:", e.message.slice(0, 80));
      }
    }
    // Verify
    const { rows } = await pg.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name`
    );
    console.log(`\nTotal tables: ${rows.length}`);
    console.log(rows.map(r => r.table_name).join(", "));
  } finally {
    pg.release();
    pool.end();
  }
}
run();
