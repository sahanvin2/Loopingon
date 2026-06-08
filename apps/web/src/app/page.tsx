import { Suspense } from "react";
import { TopBanner } from "@/components/layout/top-banner";
import { HeroSection } from "@/components/home/hero-section";
import { CategoryGrid } from "@/components/home/category-grid";
import { TrendingThisWeek } from "@/components/home/trending-this-week";
import { ProductSection } from "@/components/home/product-section";
import { PromoBanners } from "@/components/home/promo-banners";
import { ShopByRegion } from "@/components/home/shop-by-region";
import { SriLankanHeritage } from "@/components/home/sri-lankan-heritage";
import { FeaturedCreators } from "@/components/home/featured-creators";
import { CustomerReviewsBanner } from "@/components/home/customer-reviews-banner";
import { AIGiftFinder } from "@/components/home/ai-gift-finder";
import { BottomCtaSection } from "@/components/home/bottom-cta-section";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export const metadata = {
  title: "Kandyam - Sri Lanka's Handmade Craft Marketplace",
  description:
    "Kandyam connects skilled Sri Lankan artisans with customers worldwide. Discover unique handcrafted treasures made with traditional techniques and authentic materials.",
  openGraph: {
    title: "Kandyam - Sri Lanka's Handmade Craft Marketplace",
    description:
      "Discover unique handcrafted treasures made by skilled Sri Lankan artisans.",
    type: "website",
    url: "https://kandyam.com",
    images: [{ url: "https://cdn.kandyam.com/og-image.jpg", width: 1200, height: 630 }],
  },
};

export default function HomePage() {
  return (
    <>
      <TopBanner />
      <HeroSection />
      
      <CategoryGrid />
      
      <TrendingThisWeek />

      <div className="max-w-8xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Suspense fallback={<LoadingSkeleton variant="product-card" count={4} className="py-12" />}>
          <ProductSection 
            title="Recommended For You" 
            viewAllLink="/products?sort=recommended" 
            queryKey={["products", "recommended"]} 
            queryParams={{ tags: "recommended" }} 
            className="px-0 py-8"
          />
        </Suspense>
        <Suspense fallback={<LoadingSkeleton variant="product-card" count={4} className="py-12" />}>
          <ProductSection 
            title="Recently Viewed" 
            viewAllLink="/account/recently-viewed" 
            queryKey={["products", "recent"]} 
            queryParams={{ recent: true }} 
            className="px-0 py-8"
          />
        </Suspense>
      </div>

      <PromoBanners />

      <Suspense fallback={<LoadingSkeleton variant="product-card" count={5} className="py-12" />}>
        <ProductSection 
          title="New Arrivals" 
          viewAllLink="/products?sort=new" 
          queryKey={["products", "new"]} 
          queryParams={{ sort: "new" }} 
          columns="5"
          limit={5}
        />
      </Suspense>

      <Suspense fallback={<LoadingSkeleton variant="product-card" count={5} className="py-12" />}>
        <ProductSection 
          title={
            <span className="flex items-center gap-2">
              Best Sellers <span className="text-xl">🏆</span>
            </span>
          } 
          viewAllLink="/products?sort=bestsellers" 
          queryKey={["products", "bestsellers"]} 
          queryParams={{ sort: "popular" }} 
          columns="5"
          limit={5}
        />
      </Suspense>

      <ShopByRegion />
      
      <SriLankanHeritage />
      
      <FeaturedCreators />
      
      <CustomerReviewsBanner />
      
      <AIGiftFinder />
      
      <BottomCtaSection />
    </>
  );
}
