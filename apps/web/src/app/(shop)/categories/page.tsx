import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { get } from "@/lib/api-client";
import type { Category, PaginatedResponse } from "@/types";
import { getImageUrl } from "@/lib/utils";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export const metadata: Metadata = {
  title: "Browse by Craft Category - All Categories",
  description: "Explore Sri Lankan crafts by category. Pottery, wood carving, textiles, batik, jewelry, brass work, and more traditional handmade crafts.",
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
      <section className="bg-cream-50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Categories" }]} />
          <h1 className="mt-4 font-serif text-3xl font-bold text-charcoal-900 md:text-4xl">Browse by Craft Category</h1>
          <div className="relative mx-auto mt-4 max-w-md">
            <input type="text" placeholder="Search categories..." className="w-full rounded-lg border border-charcoal-200 bg-white px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none" />
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="bg-white py-12">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="font-serif text-2xl font-bold text-charcoal-900">Featured Categories</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((cat) => (
                <Link key={cat.id} href={`/categories/${cat.slug}`} className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-muted-200">
                  {cat.image ? (
                    <Image src={getImageUrl(cat.image)} alt={cat.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-rose-400 to-blush-400" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-serif text-xl font-bold text-white">{cat.name}</h3>
                    <span className="mt-1 inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-xs text-white backdrop-blur-sm">{cat.productCount} products</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-cream-50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-serif text-2xl font-bold text-charcoal-900">All Categories</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {rest.map((cat) => (
              <Link key={cat.id} href={`/categories/${cat.slug}`} className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-soft-sm transition-shadow hover:shadow-soft">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-cream-50">
                  {cat.image ? <Image src={getImageUrl(cat.image)} alt={cat.name} width={56} height={56} className="object-cover" /> : <span className="text-2xl">{cat.icon || "🛍️"}</span>}
                </div>
                <div>
                  <h3 className="font-medium text-charcoal-800">{cat.name}</h3>
                  <span className="text-xs text-muted-500">{cat.productCount} products</span>
                </div>
              </Link>
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
