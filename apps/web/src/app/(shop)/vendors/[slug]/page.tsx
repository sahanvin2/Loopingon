import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { get } from "@/lib/api-client";
import type { Vendor, ApiResponse } from "@/types";
import { getImageUrl } from "@/lib/utils";
import { VendorStorefrontHeader } from "@/components/vendor/vendor-storefront-header";
import { ProductGrid } from "@/components/product/product-grid";
import { VendorStory } from "@/components/vendor/vendor-story";
import { ProductReviews } from "@/components/product/product-reviews";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

interface VendorPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: VendorPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await get<ApiResponse<Vendor & { products: unknown[] }>>(`/vendors/storefront/${slug}`);
    const vendor = res.data;
    return {
      title: `${vendor.storeName} - Artisan on Kandyam`,
      description: vendor.storeDescription?.substring(0, 160) || `Shop handmade crafts from ${vendor.storeName} on Kandyam.`,
    };
  } catch {
    return { title: "Vendor Storefront" };
  }
}

async function VendorContent({ slug }: { slug: string }) {
  let vendor: Vendor | null = null;
  let products: unknown[] = [];
  let reviews: unknown[] = [];

  try {
    const res = await get<ApiResponse<Vendor & { products: unknown[]; reviews?: unknown[] }>>(`/vendors/storefront/${slug}`);
    vendor = res.data;
    products = res.data.products || [];
    reviews = res.data.reviews || [];
  } catch {
    notFound();
  }

  if (!vendor) notFound();

  const safeReviews = Array.isArray(reviews) ? (reviews as any[]) : [];
  const reviewCount = safeReviews.length;
  const averageRating =
    reviewCount > 0
      ? safeReviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) /
        reviewCount
      : 0;

  return (
    <>
      <div className="bg-surface-50 py-6">
        <div className="mx-auto max-w-7xl px-4">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Artisans", href: "/vendors" }, { label: vendor.storeName }]} />
        </div>
      </div>

      <VendorStorefrontHeader vendor={vendor} />

      <div className="bg-surface-50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <section className="mb-12">
            <h2 className="mb-6 font-serif text-2xl font-bold text-text-900">Products</h2>
            <ProductGrid products={Array.isArray(products) ? products as any[] : []} />
          </section>

          <section className="mb-12 rounded-xl bg-white p-6 shadow-soft-sm">
            <h2 className="font-serif text-2xl font-bold text-text-900">About the Artisan</h2>
            <VendorStory
              story={vendor.craftDescription || vendor.storeDescription || ""}
              image={vendor.storeBanner || vendor.storeLogo || undefined}
            />
          </section>

          <section className="rounded-xl bg-white p-6 shadow-soft-sm">
            <h2 className="font-serif text-2xl font-bold text-text-900">Reviews</h2>
            <ProductReviews
              reviews={safeReviews as any[]}
              averageRating={averageRating}
              reviewCount={reviewCount}
            />
          </section>
        </div>
      </div>
    </>
  );
}

export default async function VendorPage({ params }: VendorPageProps) {
  return (
    <Suspense fallback={<LoadingSkeleton variant="card" count={4} className="py-16" />}>
      <VendorContent slug={(await params).slug} />
    </Suspense>
  );
}
