import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { get } from "@/lib/api-client";
import type { Category, Product, ApiResponse, PaginatedResponse } from "@/types";
import { getImageUrl } from "@/lib/utils";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { ProductGrid } from "@/components/product/product-grid";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await get<ApiResponse<Category>>(`/categories/${slug}`);
    return {
      title: res.data.metaTitle || res.data.name,
      description: res.data.metaDescription || res.data.description || `Browse ${res.data.name} handmade by Sri Lankan artisans.`,
    };
  } catch {
    return { title: "Category" };
  }
}

async function CategoryContent({ slug }: { slug: string }) {
  let category: Category | null = null;
  let products: Product[] = [];

  try {
    const catRes = await get<ApiResponse<Category>>(`/categories/${slug}`);
    category = catRes.data;
    const prodRes = await get<PaginatedResponse<Product>>(`/categories/${category.id}/products`, { limit: 12 });
    products = prodRes.data;
  } catch {
    notFound();
  }

  if (!category) notFound();

  return (
    <>
      <div className="relative overflow-hidden">
        {category.image ? (
          <div className="relative h-48 md:h-64">
            <Image src={getImageUrl(category.image)} alt={category.name} fill className="object-cover" priority sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/70 to-transparent" />
          </div>
        ) : (
          <div className="h-48 md:h-64 bg-gradient-to-r from-terracotta-600 to-gold-500" />
        )}
        <div className="absolute top-0 left-0 right-0 p-6 md:p-8">
          <div className="mx-auto max-w-7xl">
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Categories", href: "/categories" }, { label: category.name }]} className="text-cream-200" />
            <h1 className="mt-3 font-serif text-3xl font-bold text-white md:text-4xl">{category.name}</h1>
            {category.description && <p className="mt-2 max-w-xl text-sm text-cream-200">{category.description}</p>}
          </div>
        </div>
      </div>

      <div className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4">
          {category.children && category.children.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-2">
              {category.children.map((sub) => (
                <Link key={sub.id} href={`/categories/${sub.slug}`} className="rounded-full border border-charcoal-200 px-4 py-1.5 text-sm text-charcoal-600 transition-colors hover:border-terracotta-400 hover:bg-terracotta-50 hover:text-terracotta-700">
                  {sub.name}
                </Link>
              ))}
            </div>
          )}

          <h2 className="font-serif text-2xl font-bold text-charcoal-900">Top Picks in {category.name}</h2>
          <div className="mt-6">
            {products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <div className="py-12 text-center text-warm-gray-500">No products found in this category yet.</div>
            )}
          </div>
        </div>
      </div>

      <section className="bg-cream-100 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-serif text-2xl font-bold text-charcoal-900">About Sri Lankan {category.name}</h2>
          <p className="mt-4 leading-relaxed text-warm-gray-700">
            Sri Lankan {category.name.toLowerCase()} represents centuries of artistic tradition passed down through
            generations. Artisans across the island, from the coastal villages of Galle to the hill country
            of Kandy, continue to practice these time-honored techniques using locally sourced, natural materials.
          </p>
          <p className="mt-4 leading-relaxed text-warm-gray-700">
            Every piece tells a story of skill, patience, and cultural heritage. When you purchase
            {category.name.toLowerCase()} from Loopingon, you&apos;re not just buying a product — you&apos;re
            supporting a living tradition and the families who keep it alive.
          </p>
          <div className="mt-6 space-y-2 border-t border-charcoal-200 pt-6">
            <h3 className="font-semibold text-charcoal-800">Frequently Asked Questions</h3>
            <details className="group"><summary className="cursor-pointer py-1 text-sm font-medium text-charcoal-700 hover:text-terracotta-600">What materials are used in Sri Lankan {category.name.toLowerCase()}?</summary><p className="pb-2 text-sm text-warm-gray-600">Traditional artisans use locally sourced natural materials including clay, wood, natural fibers, metals, and plant-based dyes.</p></details>
            <details className="group"><summary className="cursor-pointer py-1 text-sm font-medium text-charcoal-700 hover:text-terracotta-600">How long does it take to make each piece?</summary><p className="pb-2 text-sm text-warm-gray-600">Processing times vary from 1-2 days for simpler items to 2-4 weeks for complex, custom pieces.</p></details>
            <details className="group"><summary className="cursor-pointer py-1 text-sm font-medium text-charcoal-700 hover:text-terracotta-600">Are the colors and patterns authentic?</summary><p className="pb-2 text-sm text-warm-gray-600">Yes. All products use traditional designs and authentic Sri Lankan motifs that reflect our cultural heritage.</p></details>
          </div>
        </div>
      </section>
    </>
  );
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return (
    <Suspense fallback={<LoadingSkeleton variant="card" count={4} className="py-16" />}>
      <CategoryContent slug={(await params).slug} />
    </Suspense>
  );
}
