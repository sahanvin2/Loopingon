import { MetadataRoute } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kandyam.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/deals`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/vendors`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  try {
    // Fetch products
    const productsRes = await fetch(`${API_URL}/products?limit=1000`, { next: { revalidate: 3600 } });
    if (productsRes.ok) {
      const data = await productsRes.json();
      if (data.data?.data) {
        const productRoutes = data.data.data.map((product: any) => ({
          url: `${SITE_URL}/products/${product.slug}`,
          lastModified: new Date(product.updatedAt),
          changeFrequency: 'daily' as const,
          priority: 0.7,
        }));
        routes.push(...productRoutes);
      }
    }

    // Fetch categories
    const categoriesRes = await fetch(`${API_URL}/categories?limit=100`, { next: { revalidate: 86400 } });
    if (categoriesRes.ok) {
      const data = await categoriesRes.json();
      if (data.data?.data) {
        const categoryRoutes = data.data.data.map((category: any) => ({
          url: `${SITE_URL}/categories/${category.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        }));
        routes.push(...categoryRoutes);
      }
    }

    // Fetch vendors
    const vendorsRes = await fetch(`${API_URL}/vendors?limit=1000`, { next: { revalidate: 86400 } });
    if (vendorsRes.ok) {
      const data = await vendorsRes.json();
      if (data.data?.data) {
        const vendorRoutes = data.data.data.map((vendor: any) => ({
          url: `${SITE_URL}/vendors/${vendor.storeSlug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }));
        routes.push(...vendorRoutes);
      }
    }
  } catch (error) {
    console.error("Failed to generate dynamic sitemap routes", error);
  }

  return routes;
}
