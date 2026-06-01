import { Suspense } from "react";
import { get } from "@/lib/api-client";
import type { Product, Vendor, ApiResponse, PaginatedResponse } from "@/types";
import { TopBanner } from "@/components/layout/top-banner";
import { HeroSection } from "@/components/home/hero-section";
import { TrustBadges } from "@/components/home/trust-badges";
import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedProducts } from "@/components/home/featured-products";
import { ArtisanSpotlight } from "@/components/home/artisan-spotlight";
import { TrendingNow } from "@/components/home/trending-now";
import { HowItWorks } from "@/components/home/how-it-works";
import { Testimonials } from "@/components/home/testimonials";
import { SustainabilityBanner } from "@/components/home/sustainability-banner";
import { NewsletterSignup } from "@/components/layout/newsletter-signup";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export const metadata = {
  title: "Loopingon - Sri Lanka's Handmade Craft Marketplace",
  description:
    "Loopingon connects skilled Sri Lankan artisans with customers worldwide. Discover unique handcrafted treasures made with traditional techniques and authentic materials.",
  openGraph: {
    title: "Loopingon - Sri Lanka's Handmade Craft Marketplace",
    description:
      "Discover unique handcrafted treasures made by skilled Sri Lankan artisans.",
    type: "website",
    url: "https://loopingon.com",
    images: [{ url: "https://cdn.loopingon.com/og-image.jpg", width: 1200, height: 630 }],
  },
};

async function FeaturedProductsSection() {
  let products: Product[] = [];
  try {
    const res = await get<PaginatedResponse<Product>>("/products", { limit: 8, isFeatured: true });
    products = res.data;
  } catch {}
  return <FeaturedProducts products={products} />;
}

async function ArtisanSpotlightSection() {
  let vendors: Vendor[] = [];
  try {
    const res = await get<PaginatedResponse<Vendor>>("/vendors", { limit: 4, sort: "top_rated" });
    vendors = res.data;
  } catch {}
  return <ArtisanSpotlight vendors={vendors} />;
}

async function TrendingNowSection() {
  let products: Product[] = [];
  try {
    const res = await get<PaginatedResponse<Product>>("/products", { limit: 6, sort: "trending" });
    products = res.data;
  } catch {}
  return <TrendingNow products={products} />;
}

export default function HomePage() {
  return (
    <>
      <TopBanner />
      <HeroSection />
      <TrustBadges />
      <CategoryGrid />
      <Suspense fallback={<LoadingSkeleton variant="product-card" count={4} className="py-16" />}>
        <FeaturedProductsSection />
      </Suspense>
      <Suspense fallback={<LoadingSkeleton variant="card" count={4} className="py-16" />}>
        <ArtisanSpotlightSection />
      </Suspense>
      <Suspense fallback={<LoadingSkeleton variant="product-card" count={6} className="py-16" />}>
        <TrendingNowSection />
      </Suspense>
      <HowItWorks />
      <Testimonials />
      <SustainabilityBanner />
      <NewsletterSignup />
    </>
  );
}
