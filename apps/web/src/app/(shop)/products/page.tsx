import { Suspense } from "react";
import { Metadata } from "next";
import { get } from "@/lib/api-client";
import type { Product, PaginatedResponse } from "@/types";
import { ProductGrid } from "@/components/product/product-grid";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Pagination } from "@/components/shared/pagination";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Explore Handmade Treasures - Shop All Products",
  description: "Browse thousands of handmade crafts from Sri Lankan artisans. Pottery, wood carving, textiles, jewelry, and more. Ethical, fair trade, unique treasures.",
};

interface ProductsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    craftType?: string;
    minPrice?: string;
    maxPrice?: string;
    rating?: string;
    district?: string;
    sort?: string;
    page?: string;
    onSale?: string;
    isHandmade?: string;
    isEcoFriendly?: string;
  }>;
}

async function ProductsContent({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const queryParams: Record<string, unknown> = { page, limit: 12 };

  if (params.q) queryParams.query = params.q;
  if (params.category) queryParams.category = params.category;
  if (params.craftType) queryParams.craftType = params.craftType;
  if (params.minPrice) queryParams.minPrice = parseFloat(params.minPrice);
  if (params.maxPrice) queryParams.maxPrice = parseFloat(params.maxPrice);
  if (params.rating) queryParams.rating = parseInt(params.rating);
  if (params.district) queryParams.district = params.district;
  if (params.sort) queryParams.sort = params.sort;
  if (params.onSale) queryParams.onSale = true;
  if (params.isHandmade) queryParams.isHandmade = true;
  if (params.isEcoFriendly) queryParams.isEcoFriendly = true;

  let products: Product[] = [];
  let total = 0;
  let totalPages = 1;

  try {
    const res = await get<PaginatedResponse<Product>>("/products", queryParams);
    products = res.data;
    total = res.meta.total;
    totalPages = res.meta.totalPages;
  } catch {}

  const breadcrumbs = [{ label: "Home", href: "/" }, { label: "Products" }];

  return (
    <>
      <div className="bg-cream-100 py-8">
        <div className="mx-auto max-w-7xl px-4">
          <Breadcrumb items={breadcrumbs} />
          <h1 className="mt-4 font-serif text-3xl font-bold text-charcoal-900 md:text-4xl">
            Explore Handmade Treasures
          </h1>
          <p className="mt-2 text-warm-gray-500">
            Showing {products.length} of {total} products
          </p>
        </div>
      </div>

      <section className="bg-white py-8">
        <div className="mx-auto max-w-7xl px-4">
          {products.length > 0 ? (
            <>
              <ProductGrid products={products} />
              {totalPages > 1 && (
                <div className="mt-10 flex justify-center">
                  <Pagination currentPage={page} totalPages={totalPages} baseUrl="/products" />
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center">
              <p className="text-lg text-warm-gray-500">No products found matching your criteria.</p>
              <p className="mt-2 text-sm text-warm-gray-400">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  return (
    <Suspense fallback={<LoadingSkeleton variant="product-card" count={8} className="py-16" />}>
      <ProductsContent searchParams={searchParams} />
    </Suspense>
  );
}
