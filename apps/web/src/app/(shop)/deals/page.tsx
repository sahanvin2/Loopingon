import { Suspense } from "react";
import { Metadata } from "next";
import { get } from "@/lib/api-client";
import type { Product, PaginatedResponse } from "@/types";
import { ProductGrid } from "@/components/product/product-grid";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Pagination } from "@/components/shared/pagination";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export const metadata: Metadata = {
  title: "Today's Deals - Save on Handmade Crafts",
  description: "Find the best deals on Sri Lankan handmade crafts. Flash deals, clearance sales, bundle discounts, and more. Limited time offers on artisan products.",
};

interface DealsPageProps {
  searchParams: Promise<{ filter?: string; sort?: string; page?: string }>;
}

async function DealsContent({ searchParams }: DealsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const filter = params.filter || "all";
  const sort = params.sort || "discount_desc";

  let products: Product[] = [];
  let totalPages = 1;

  try {
    const res = await get<PaginatedResponse<Product>>("/products/deals", { page, limit: 12, filter, sort });
    products = res.data;
    totalPages = res.meta.totalPages;
  } catch {}

  const tabs = [
    { label: "All Deals", value: "all" },
    { label: "Flash Deals", value: "flash" },
    { label: "Clearance", value: "clearance" },
    { label: "Bundle Deals", value: "bundle" },
  ];

  return (
    <>
      <section className="bg-surface-50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Deals" }]} />
          <h1 className="mt-4 font-serif text-3xl font-bold text-text-900 md:text-4xl">Today&lsquo;s Deals</h1>
          <p className="mt-2 text-muted-500">Limited-time offers on authentic Sri Lankan handmade crafts</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const isActive = filter === tab.value || (tab.value === "all" && !filter);
              return (
                <a
                  key={tab.value}
                  href={`/deals?filter=${tab.value}`}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive ? "bg-primary-600 text-white" : "bg-white text-text-600 hover:bg-primary-50"
                  }`}
                >
                  {tab.label}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="mx-auto max-w-7xl px-4">
          {products.length > 0 ? (
            <>
              <ProductGrid products={products} />
              {totalPages > 1 && (
                <div className="mt-10 flex justify-center">
                  <Pagination currentPage={page} totalPages={totalPages} baseUrl="/deals" />
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center">
              <p className="text-lg text-muted-500">No deals available at the moment.</p>
              <p className="mt-1 text-sm text-muted-400">Check back soon for new offers!</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function DealsPage({ searchParams }: DealsPageProps) {
  return (
    <Suspense fallback={<LoadingSkeleton variant="product-card" count={8} className="py-16" />}>
      <DealsContent searchParams={searchParams} />
    </Suspense>
  );
}
