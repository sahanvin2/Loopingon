import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { get } from "@/lib/api-client";
import type { Product, ApiResponse } from "@/types";
import { getImageUrl } from "@/lib/utils";
import { ProductDetail } from "@/components/product/product-detail";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export const revalidate = 3600;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await get<ApiResponse<Product>>(`/products/${slug}`);
    const product = res.data;
    const primaryImage = product.images?.find((i) => i.isPrimary) || product.images?.[0];
    return {
      title: product.metaTitle || product.title,
      description: product.metaDescription || product.shortDescription || product.description.substring(0, 160),
      openGraph: {
        title: product.title,
        description: product.shortDescription || product.description.substring(0, 160),
        type: "product",
        images: primaryImage ? [{ url: getImageUrl(primaryImage.large || primaryImage.url), width: 800, height: 800 }] : [],
      },
    };
  } catch {
    return { title: "Product" };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  let product: Product | null = null;

  try {
    const res = await get<ApiResponse<Product>>(`/products/${slug}`);
    product = res.data;
  } catch {
    notFound();
  }

  if (!product) notFound();

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    ...(product.categories?.[0]?.category ? [{ label: product.categories[0].category.name, href: `/categories/${product.categories[0].category.slug}` }] : []),
    { label: product.title },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images?.map((i) => i.url),
    sku: product.sku,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency || "LKR",
      availability: product.quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: product.vendor ? { "@type": "Person", name: product.vendor.storeName } : undefined,
    },
    aggregateRating: product.reviewCount > 0 ? { "@type": "AggregateRating", ratingValue: product.averageRating, reviewCount: product.reviewCount } : undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="bg-cream-100 py-6">
        <div className="mx-auto max-w-7xl px-4">
          <Breadcrumb items={breadcrumbs} />
        </div>
      </div>
      <Suspense fallback={<LoadingSkeleton variant="detail" className="py-16" />}>
        <ProductDetail product={product} />
      </Suspense>
    </>
  );
}
