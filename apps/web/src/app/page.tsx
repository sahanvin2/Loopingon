import { Suspense } from "react";
import { TopBanner } from "@/components/layout/top-banner";
import { HeroSection } from "@/components/home/hero-section";
import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedProducts } from "@/components/home/featured-products";
import { TrendingNow } from "@/components/home/trending-now";
import { HowItWorks } from "@/components/home/how-it-works";
import { Testimonials } from "@/components/home/testimonials";
import { SustainabilityBanner } from "@/components/home/sustainability-banner";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { EditorsPicks } from "@/components/home/editors-picks";
import { RecentlyViewed } from "@/components/home/recently-viewed";

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

export default function HomePage() {
  return (
    <>
      <TopBanner />
      <HeroSection />
      <Suspense fallback={<LoadingSkeleton variant="product-card" count={4} className="py-16" />}>
        <EditorsPicks />
      </Suspense>
      <CategoryGrid />
      <Suspense fallback={<LoadingSkeleton variant="product-card" count={6} className="py-16" />}>
        <RecentlyViewed />
      </Suspense>
      <Suspense fallback={<LoadingSkeleton variant="product-card" count={6} className="py-16" />}>
        <TrendingNow />
      </Suspense>
      <Suspense fallback={<LoadingSkeleton variant="product-card" count={4} className="py-16" />}>
        <FeaturedProducts />
      </Suspense>
      <HowItWorks />
      <Testimonials />
      <SustainabilityBanner />
    </>
  );
}
