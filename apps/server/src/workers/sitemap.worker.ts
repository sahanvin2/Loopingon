import { Worker, Queue, type Job } from "bullmq";
import { REDIS_URL } from "../config/redis.js";
import { prisma } from "../config/database.js";
import { logger } from "../middleware/errorHandler.middleware.js";

const QUEUE_NAME = "sitemap";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

interface SitemapUrlEntry {
  url: string;
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
  lastmod?: string;
}

interface SitemapJobData {
  baseUrl?: string;
  includeCategories?: boolean;
  includeProducts?: boolean;
  includeVendors?: boolean;
  includeBlog?: boolean;
  includeCompetitions?: boolean;
  includeStaticPages?: boolean;
}

let _sitemapQueue: Queue<SitemapJobData> | null = null;

export function getSitemapQueue(): Queue<SitemapJobData> {
  if (!_sitemapQueue) {
    _sitemapQueue = new Queue<SitemapJobData>(QUEUE_NAME, {
      connection: { url: REDIS_URL },
      defaultJobOptions: {
        attempts: 2,
        backoff: { type: "fixed", delay: 10000 },
        removeOnComplete: { age: 86400 * 7 },
        removeOnFail: { age: 86400 * 30 },
      },
    });
  }
  return _sitemapQueue!;
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function buildSitemapXml(entries: SitemapUrlEntry[]): string {
  const urlElements = entries
    .map(
      (entry) => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod || formatDate(new Date())}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="${FRONTEND_URL}/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlElements}
</urlset>`;
}

const STATIC_PAGES: SitemapUrlEntry[] = [
  { url: `${FRONTEND_URL}`, changefreq: "daily", priority: 1.0 },
  { url: `${FRONTEND_URL}/products`, changefreq: "daily", priority: 0.9 },
  { url: `${FRONTEND_URL}/categories`, changefreq: "weekly", priority: 0.8 },
  { url: `${FRONTEND_URL}/vendors`, changefreq: "daily", priority: 0.8 },
  { url: `${FRONTEND_URL}/competitions`, changefreq: "daily", priority: 0.7 },
  { url: `${FRONTEND_URL}/blog`, changefreq: "daily", priority: 0.7 },
  { url: `${FRONTEND_URL}/about`, changefreq: "monthly", priority: 0.5 },
  { url: `${FRONTEND_URL}/contact`, changefreq: "monthly", priority: 0.4 },
  { url: `${FRONTEND_URL}/help`, changefreq: "monthly", priority: 0.4 },
  { url: `${FRONTEND_URL}/faq`, changefreq: "monthly", priority: 0.4 },
  { url: `${FRONTEND_URL}/privacy`, changefreq: "yearly", priority: 0.3 },
  { url: `${FRONTEND_URL}/terms`, changefreq: "yearly", priority: 0.3 },
  { url: `${FRONTEND_URL}/returns`, changefreq: "yearly", priority: 0.3 },
  { url: `${FRONTEND_URL}/shipping`, changefreq: "yearly", priority: 0.3 },
  { url: `${FRONTEND_URL}/sell`, changefreq: "monthly", priority: 0.6 },
  { url: `${FRONTEND_URL}/login`, changefreq: "monthly", priority: 0.3 },
  { url: `${FRONTEND_URL}/register`, changefreq: "monthly", priority: 0.3 },
];

const sitemapWorker = new Worker<SitemapJobData>(
  QUEUE_NAME,
  async (job: Job<SitemapJobData>) => {
    logger.info(`Regenerating sitemap job ${job.id}`);

    const {
      includeCategories = true,
      includeProducts = true,
      includeVendors = true,
      includeBlog = true,
      includeCompetitions = true,
      includeStaticPages = true,
    } = job.data;

    const entries: SitemapUrlEntry[] = [];

    if (includeStaticPages) {
      entries.push(...STATIC_PAGES);
      logger.info(`Added ${STATIC_PAGES.length} static pages`);
    }

    if (includeCategories) {
      const categories = await prisma.category.findMany({
        where: { isActive: true, deletedAt: null },
        select: { slug: true, updatedAt: true, level: true },
      });

      for (const cat of categories) {
        const priority = cat.level === 0 ? 0.7 : 0.5;
        entries.push({
          url: `${FRONTEND_URL}/categories/${cat.slug}`,
          changefreq: "weekly",
          priority,
          lastmod: formatDate(cat.updatedAt),
        });
      }
      logger.info(`Added ${categories.length} categories`);
    }

    if (includeProducts) {
      const products = await prisma.product.findMany({
        where: { status: "PUBLISHED", deletedAt: null },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      });

      for (const product of products) {
        entries.push({
          url: `${FRONTEND_URL}/products/${product.slug}`,
          changefreq: "weekly",
          priority: 0.7,
          lastmod: formatDate(product.updatedAt),
        });
      }
      logger.info(`Added ${products.length} products`);
    }

    if (includeVendors) {
      const vendors = await prisma.vendor.findMany({
        where: { status: "VERIFIED", deletedAt: null },
        select: { storeSlug: true, updatedAt: true },
      });

      for (const vendor of vendors) {
        entries.push({
          url: `${FRONTEND_URL}/store/${vendor.storeSlug}`,
          changefreq: "daily",
          priority: 0.8,
          lastmod: formatDate(vendor.updatedAt),
        });
      }
      logger.info(`Added ${vendors.length} vendors`);
    }

    if (includeBlog) {
      const posts = await prisma.blogPost.findMany({
        where: { isPublished: true },
        select: { slug: true, publishedAt: true, updatedAt: true },
        orderBy: { publishedAt: "desc" },
      });

      for (const post of posts) {
        entries.push({
          url: `${FRONTEND_URL}/blog/${post.slug}`,
          changefreq: "monthly",
          priority: 0.5,
          lastmod: formatDate(post.publishedAt || post.updatedAt),
        });
      }
      logger.info(`Added ${posts.length} blog posts`);
    }

    if (includeCompetitions) {
      const competitions = await prisma.competition.findMany({
        where: { status: { in: ["UPCOMING", "ACTIVE"] } },
        select: { slug: true, updatedAt: true },
      });

      for (const competition of competitions) {
        entries.push({
          url: `${FRONTEND_URL}/competitions/${competition.slug}`,
          changefreq: "daily",
          priority: 0.7,
          lastmod: formatDate(competition.updatedAt),
        });
      }
      logger.info(`Added ${competitions.length} competitions`);
    }

    const xml = buildSitemapXml(entries);

    for (const entry of entries) {
      await prisma.sitemapUrl.upsert({
        where: { url: entry.url },
        create: {
          url: entry.url,
          changefreq: entry.changefreq,
          priority: entry.priority,
          lastmod: entry.lastmod ? new Date(entry.lastmod) : new Date(),
        },
        update: {
          changefreq: entry.changefreq,
          priority: entry.priority,
          lastmod: entry.lastmod ? new Date(entry.lastmod) : new Date(),
        },
      });
    }

    logger.info(`Sitemap generated with ${entries.length} URLs (${xml.length} bytes)`);

    return { urlCount: entries.length, bytes: xml.length };
  },
  {
    connection: { url: REDIS_URL },
    concurrency: 1,
  }
);

sitemapWorker.on("failed", (job, err) => {
  logger.error(`Sitemap job ${job?.id} failed: ${err.message}`, { jobId: job?.id, error: err });
});

sitemapWorker.on("completed", (job) => {
  logger.info(`Sitemap job ${job.id} completed`);
});

export async function regenerateSitemap(options?: SitemapJobData) {
  return getSitemapQueue().add("regenerate", options || {}, {
    jobId: `sitemap-${Date.now()}`,
  });
}

export { sitemapWorker };
