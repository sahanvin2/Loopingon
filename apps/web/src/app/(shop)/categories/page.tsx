import { Suspense } from "react";
import Link from "next/link";
import { Metadata } from "next";
import { get } from "@/lib/api-client";
import type { Category, PaginatedResponse } from "@/types";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export const metadata: Metadata = {
  title: "All Categories - Browse the Marketplace",
  description: "Explore all categories on our marketplace. From clothing to electronics, home decor, and gifts, discover a wide range of products.",
};

async function CategoriesContent() {
  let categories: Category[] = [];
  try {
    const res = await get<PaginatedResponse<Category>>("/categories", { limit: 50 });
    categories = res.data;
  } catch {}

  const featured = categories.filter((c) => c.isFeatured);
  const rest = categories.filter((c) => !c.isFeatured);

  return (
    <>
      <section className="bg-surface-50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Categories" }]} />
          <h1 className="mt-4 font-serif text-3xl font-bold text-text-900 md:text-4xl">Browse All Categories</h1>
          <div className="relative mx-auto mt-4 max-w-md">
            <input type="text" placeholder="Search categories..." className="w-full rounded-lg border border-text-200 bg-white px-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none" />
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat) => (
              <div key={cat.id} className="group">
                <Link href={`/categories/${cat.slug}`} className="inline-block">
                  <h2 className="font-serif text-xl font-bold text-text-900 group-hover:text-primary-600 transition-colors">
                    {cat.name}
                  </h2>
                </Link>
                {cat.description && (
                  <p className="mt-2 text-sm text-text-600 line-clamp-2">
                    {cat.description}
                  </p>
                )}
                <div className="mt-3">
                  <Link href={`/categories/${cat.slug}`} className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                    Explore {cat.productCount > 0 ? `${cat.productCount} products` : "category"} &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<LoadingSkeleton variant="card" count={8} className="py-16" />}>
      <CategoriesContent />
    </Suspense>
  );
}
