// Create all remaining Prisma tables
const { Pool } = require("pg");
const pool = new Pool({
  connectionString: "postgresql://postgres:@20040301Sahan@db.lbrggticuwyqmdtllxsh.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false },
});

const TABLES = [
  `CREATE TABLE IF NOT EXISTS public.product_variants (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), "productId" UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE, name TEXT NOT NULL, sku TEXT, price DECIMAL(10,2), quantity INTEGER DEFAULT 0, attributes JSONB, "sortOrder" INTEGER DEFAULT 0, "createdAt" TIMESTAMPTZ DEFAULT now(), "updatedAt" TIMESTAMPTZ DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS public.inventory_logs (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), "productId" UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE, "variantId" UUID, change INTEGER NOT NULL, reason TEXT NOT NULL, reference TEXT, "createdAt" TIMESTAMPTZ DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS public.order_status_history (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), "orderId" UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE, status "OrderStatus" NOT NULL, note TEXT, "changedBy" TEXT, "createdAt" TIMESTAMPTZ DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS public.shipments (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), "orderId" UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE, "courierName" TEXT NOT NULL, "trackingNumber" TEXT NOT NULL, "trackingUrl" TEXT, status TEXT NOT NULL, "statusUpdatedAt" TIMESTAMPTZ, "shippedAt" TIMESTAMPTZ, "estimatedDelivery" TIMESTAMPTZ, "deliveredAt" TIMESTAMPTZ, notes TEXT, "createdAt" TIMESTAMPTZ DEFAULT now(), "updatedAt" TIMESTAMPTZ DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS public.order_disputes (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), "orderId" UUID UNIQUE NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE, reason TEXT NOT NULL, description TEXT NOT NULL, status TEXT DEFAULT 'PENDING', resolution TEXT, "resolvedBy" TEXT, "resolvedAt" TIMESTAMPTZ, "createdAt" TIMESTAMPTZ DEFAULT now(), "updatedAt" TIMESTAMPTZ DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS public.payment_transactions (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), "orderId" UUID, "userId" UUID NOT NULL, "vendorId" UUID, amount DECIMAL(12,2) NOT NULL, currency TEXT DEFAULT 'LKR', "gatewayName" TEXT NOT NULL, "gatewayTransactionId" TEXT, "gatewayResponse" JSONB, status "PaymentStatus" DEFAULT 'PENDING', "paymentMethod" TEXT, "commissionAmount" DECIMAL(12,2) DEFAULT 0, "vendorAmount" DECIMAL(12,2) DEFAULT 0, "platformFee" DECIMAL(12,2) DEFAULT 0, "refundAmount" DECIMAL(12,2), "refundedAt" TIMESTAMPTZ, metadata JSONB, "createdAt" TIMESTAMPTZ DEFAULT now(), "updatedAt" TIMESTAMPTZ DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS public.payout_schedules (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), "vendorId" UUID NOT NULL, "periodStart" TIMESTAMPTZ NOT NULL, "periodEnd" TIMESTAMPTZ NOT NULL, "totalOrders" INTEGER DEFAULT 0, "totalRevenue" DECIMAL(12,2) DEFAULT 0, "totalCommission" DECIMAL(12,2) DEFAULT 0, "payoutAmount" DECIMAL(12,2) DEFAULT 0, status "PayoutStatus" DEFAULT 'PENDING', "transactionId" UUID UNIQUE, "bankDetailUsed" TEXT NOT NULL, "processedAt" TIMESTAMPTZ, notes TEXT, "createdAt" TIMESTAMPTZ DEFAULT now(), "updatedAt" TIMESTAMPTZ DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS public.message_threads (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), subject TEXT, "orderId" UUID, "createdAt" TIMESTAMPTZ DEFAULT now(), "updatedAt" TIMESTAMPTZ DEFAULT now(), "lastMessageAt" TIMESTAMPTZ, "lastMessage" TEXT)`,
  `CREATE TABLE IF NOT EXISTS public.messages (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), "threadId" UUID NOT NULL, "senderId" UUID NOT NULL, content TEXT NOT NULL, attachments TEXT[], "isRead" BOOLEAN DEFAULT false, "readAt" TIMESTAMPTZ, "createdAt" TIMESTAMPTZ DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS public.notifications (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), "userId" UUID NOT NULL, type TEXT NOT NULL, channel TEXT NOT NULL, title TEXT NOT NULL, body TEXT NOT NULL, data JSONB, "isRead" BOOLEAN DEFAULT false, "readAt" TIMESTAMPTZ, "deliveredAt" TIMESTAMPTZ, "errorMessage" TEXT, "createdAt" TIMESTAMPTZ DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS public.coupon_usages (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), "couponId" UUID NOT NULL, "userId" UUID NOT NULL, "orderId" UUID NOT NULL, "discountAmount" DECIMAL(10,2) NOT NULL, "createdAt" TIMESTAMPTZ DEFAULT now(), UNIQUE("couponId", "userId", "orderId"))`,
  `CREATE TABLE IF NOT EXISTS public.vendor_verification_docs (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), "vendorId" UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE, "docType" TEXT NOT NULL, "docUrl" TEXT NOT NULL, "docName" TEXT NOT NULL, "verifiedAt" TIMESTAMPTZ, "verifiedBy" TEXT, notes TEXT, "createdAt" TIMESTAMPTZ DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS public.referral_codes (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), "userId" UUID UNIQUE NOT NULL, code TEXT UNIQUE NOT NULL, "totalReferrals" INTEGER DEFAULT 0, "totalEarnings" DECIMAL(10,2) DEFAULT 0, status TEXT DEFAULT 'active', "joinedAt" TIMESTAMPTZ, "acceptedTermsAt" TIMESTAMPTZ, "bankDetails" JSONB, "createdAt" TIMESTAMPTZ DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS public.referrals (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), "referrerId" UUID NOT NULL, "referredUserId" UUID NOT NULL, "referralCodeStr" TEXT NOT NULL, "referralCodeId" UUID, status TEXT DEFAULT 'pending', "rewardAmount" DECIMAL(10,2), "rewardClaimed" BOOLEAN DEFAULT false, "completedAt" TIMESTAMPTZ, "createdAt" TIMESTAMPTZ DEFAULT now(), UNIQUE("referredUserId"))`,
  `CREATE TABLE IF NOT EXISTS public.loyalty_accounts (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), "userId" UUID UNIQUE NOT NULL, "totalSpent" DECIMAL(12,2) DEFAULT 0, tier TEXT DEFAULT 'none', "rewardBalance" DECIMAL(10,2) DEFAULT 0, "claimedAt" TIMESTAMPTZ, "claimedTier" TEXT, "createdAt" TIMESTAMPTZ DEFAULT now(), "updatedAt" TIMESTAMPTZ DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS public.loyalty_transactions (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), "accountId" UUID NOT NULL, amount DECIMAL(10,2), type TEXT NOT NULL, tier TEXT, reference TEXT, description TEXT NOT NULL, "expiresAt" TIMESTAMPTZ, "createdAt" TIMESTAMPTZ DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS public.competitions (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), title TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, description TEXT NOT NULL, "bannerImage" TEXT, "craftType" TEXT, theme TEXT, status TEXT DEFAULT 'UPCOMING', "startDate" TIMESTAMPTZ NOT NULL, "endDate" TIMESTAMPTZ NOT NULL, "judgingStartDate" TIMESTAMPTZ, "judgingEndDate" TIMESTAMPTZ, "prizeDescription" TEXT NOT NULL, "prizeValue" DECIMAL(10,2), rules TEXT NOT NULL, "maxEntries" INTEGER DEFAULT 100, "entryFee" DECIMAL(10,2) DEFAULT 0, "isFreeEntry" BOOLEAN DEFAULT true, "createdAt" TIMESTAMPTZ DEFAULT now(), "updatedAt" TIMESTAMPTZ DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS public.competition_entries (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), "competitionId" UUID NOT NULL, "userId" UUID NOT NULL, "productId" UUID NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL, images TEXT[], "voteCount" INTEGER DEFAULT 0, status TEXT DEFAULT 'submitted', "submittedAt" TIMESTAMPTZ DEFAULT now(), "createdAt" TIMESTAMPTZ DEFAULT now(), "updatedAt" TIMESTAMPTZ DEFAULT now(), UNIQUE("competitionId", "productId"))`,
  `CREATE TABLE IF NOT EXISTS public.competition_votes (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), "entryId" UUID NOT NULL, "userId" UUID NOT NULL, "createdAt" TIMESTAMPTZ DEFAULT now(), UNIQUE("entryId", "userId"))`,
  `CREATE TABLE IF NOT EXISTS public.support_tickets (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), "ticketNumber" TEXT UNIQUE NOT NULL, "userId" UUID NOT NULL, subject TEXT NOT NULL, category TEXT NOT NULL, priority TEXT DEFAULT 'normal', status TEXT DEFAULT 'open', "orderId" UUID, "assignedTo" TEXT, "resolvedAt" TIMESTAMPTZ, "createdAt" TIMESTAMPTZ DEFAULT now(), "updatedAt" TIMESTAMPTZ DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS public.support_ticket_replies (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), "ticketId" UUID NOT NULL, "userId" UUID NOT NULL, content TEXT NOT NULL, attachments TEXT[], "isInternal" BOOLEAN DEFAULT false, "createdAt" TIMESTAMPTZ DEFAULT now())`,
];

async function run() {
  const pg = await pool.connect();
  try {
    for (const sql of TABLES) {
      try {
        await pg.query(sql);
        const name = sql.match(/public\.(\w+)/)?.[1] || "?";
        console.log("  Created:", name);
      } catch (e) {
        console.log("  Skip:", e.message.slice(0, 80));
      }
    }
    const { rows } = await pg.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name"
    );
    console.log("\nTotal tables:", rows.length);
    console.log(rows.map((r) => r.table_name).join(", "));
  } finally {
    pg.release();
    pool.end();
  }
}
run();
