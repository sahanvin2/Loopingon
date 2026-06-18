import { Suspense } from "react";
import { LuxuryHero } from "@/components/home/luxury-hero";
import { TrustBar } from "@/components/home/trust-bar";
import { CategoryCircle } from "@/components/home/category-circle";
import { TrendingWeek } from "@/components/home/trending-week";
import { RecommendedForYou } from "@/components/home/recommended-for-you";
import { RecentlyViewed } from "@/components/home/recently-viewed";
import { FeaturedCreators } from "@/components/home/featured-creators";
import { 
  FlashDeals, 
  GiftFinder, 
  ProductGrids, 
  ShopByRegion, 
  HeritageCollection, 
  CustomerReviewsDark, 
  NewsletterSimple, 
  MobileAppSection 
} from "@/components/home/luxury-sections";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export const metadata = {
  title: "Kandiyam - Premium Marketplace for Handcrafted Sri Lankan Treasures",
  description: "Kandiyam connects you with skilled Sri Lankan sellers. Discover unique handcrafted masks, batik, jewelry, wooden carvings, and luxury crafts from sellers worldwide.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col w-full bg-main">
      {/* 1. Hero Section */}
      <LuxuryHero />
      
      {/* 2. Trust Bar */}
      <TrustBar />
      
      {/* 3. Category Grid */}
      <CategoryCircle />
      
      {/* 4. Trending This Week */}
      <TrendingWeek />
      
      {/* 5. Product Grids: New Arrivals + Best Sellers */}
      <Suspense fallback={<LoadingSkeleton variant="product-card" count={4} className="py-12" />}>
        <ProductGrids />
      </Suspense>

      {/* 6. Flash Deals with Countdown */}
      <FlashDeals />

      {/* 7. Recommended For You - Horizontal Carousel */}
      <Suspense fallback={<LoadingSkeleton variant="product-card" count={4} className="py-12" />}>
        <RecommendedForYou />
      </Suspense>

      {/* 8. Recently Viewed */}
      <Suspense fallback={<LoadingSkeleton variant="product-card" count={4} className="py-12" />}>
        <RecentlyViewed />
      </Suspense>
      
      {/* 9. Gift Finder */}
      <GiftFinder />
      
      {/* 10. Shop By Region */}
      <ShopByRegion />
      
      {/* 11. Heritage Collection - Premium */}
      <HeritageCollection />
      
      {/* 12. Featured Sellers */}
      <Suspense fallback={<LoadingSkeleton variant="product-card" count={3} className="py-12" />}>
        <FeaturedCreators />
      </Suspense>
      
      {/* 13. Customer Reviews - Social Proof */}
      <CustomerReviewsDark />
      
      {/* 14. Newsletter + Mobile App */}
      <NewsletterSimple />
      <MobileAppSection />
    </div>
  );
}