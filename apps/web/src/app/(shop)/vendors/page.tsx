import { Suspense } from "react";
import { Metadata } from "next";
import { get } from "@/lib/api-client";
import type { Vendor, PaginatedResponse } from "@/types";
import { VendorCard } from "@/components/vendor/vendor-card";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Pagination } from "@/components/shared/pagination";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export const metadata: Metadata = {
  title: "Discover Sri Lankan Artisans - All Vendors",
  description: "Meet the artisans behind every creation. Browse Sri Lankan craft vendors by name, craft type, location, and rating.",
};

interface VendorsPageProps {
  searchParams: Promise<{ q?: string; craftType?: string; district?: string; minRating?: string; verified?: string; sort?: string; page?: string }>;
}

async function VendorsContent({ searchParams }: VendorsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const queryParams: Record<string, unknown> = { page, limit: 12 };

  if (params.q) queryParams.query = params.q;
  if (params.craftType) queryParams.craftType = params.craftType;
  if (params.district) queryParams.district = params.district;
  if (params.minRating) queryParams.minRating = parseInt(params.minRating);
  if (params.verified) queryParams.verified = true;
  if (params.sort) queryParams.sort = params.sort;

  let vendors: Vendor[] = [];
  let featuredVendors: Vendor[] = [];
  let totalPages = 1;
  let total = 0;

  try {
    const [res, featRes] = await Promise.all([
      get<PaginatedResponse<Vendor>>("/vendors", queryParams),
      get<PaginatedResponse<Vendor>>("/vendors", { limit: 6, isFeatured: true }),
    ]);
    vendors = res.data;
    totalPages = res.meta.totalPages;
    total = res.meta.total;
    featuredVendors = featRes.data;
  } catch {}

  return (
    <>
      <section className="bg-surface-50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Artisans" }]} />
          <h1 className="mt-4 font-serif text-3xl font-bold text-text-900 md:text-4xl">Discover Sri Lankan Artisans</h1>
          <p className="mt-2 text-muted-500">{total} artisans across Sri Lanka</p>
        </div>
      </section>

      {featuredVendors.length > 0 && (
        <section className="bg-white py-10">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="font-serif text-2xl font-bold text-text-900">Featured Artisans</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredVendors.slice(0, 6).map((v) => (
                <VendorCard key={v.id} vendor={v} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-surface-50 py-10">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-serif text-2xl font-bold text-text-900">All Artisans</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vendors.length > 0 ? (
              vendors.map((v) => <VendorCard key={v.id} vendor={v} />)
            ) : (
              <div className="col-span-full py-12 text-center text-muted-500">No artisans found.</div>
            )}
          </div>
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <Pagination currentPage={page} totalPages={totalPages} baseUrl="/vendors" />
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function VendorsPage({ searchParams }: VendorsPageProps) {
  return (
    <Suspense fallback={<LoadingSkeleton variant="card" count={6} className="py-16" />}>
      <VendorsContent searchParams={searchParams} />
    </Suspense>
  );
}
