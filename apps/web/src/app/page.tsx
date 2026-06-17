import { Suspense } from "react";
import { TopBanner } from "@/components/layout/top-banner";
import { HeroSection } from "@/components/home/hero-section";
import { TrustBadges } from "@/components/home/trust-badges";
import { HomeTopWidgets } from "@/components/home/home-top-widgets";
import { CircleCategories } from "@/components/home/circle-categories";
import { PromoBanners } from "@/components/home/promo-banners";
import { ProductSection } from "@/components/home/product-section";
import { ShopByCategoryCards } from "@/components/home/shop-by-category-cards";
import { CreatorsAndSellerPromo } from "@/components/home/creators-and-seller-promo";
import { CustomerReviewsBanner } from "@/components/home/customer-reviews-banner";
import { NewsletterAndApp } from "@/components/home/newsletter-and-app";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export const metadata = {
  title: "Kandyam - Global Marketplace for Unique Finds",
  description:
    "Kandyam connects you with independent sellers worldwide. Discover extraordinary items, from fashion and electronics to home decor and unique gifts.",
};

export default function HomePage() {
  return (
    <>
      <TopBanner />
      <HeroSection />
      
      <TrustBadges />
      
      {/* 3-column row: Trending | Editors' Picks | Recently Viewed */}
      <HomeTopWidgets />
      
      {/* Row of circle icons */}
      <CircleCategories />

      {/* Promos */}
      <PromoBanners />

      {/* Product Carousels/Rows */}
      <Suspense fallback={<LoadingSkeleton variant="product-card" count={4} className="py-12" />}>
        <ProductSection 
          title={
            <span className="flex items-center gap-2">
              <span className="text-yellow-500">✨</span> New Arrivals
            </span>
          } 
          viewAllLink="/products?sort=new" 
          queryKey={["products", "new"]} 
          queryParams={{ sort: "new" }} 
          columns="4"
          limit={4}
        />
      </Suspense>

      <Suspense fallback={<LoadingSkeleton variant="product-card" count={4} className="py-12" />}>
        <ProductSection 
          title={
            <span className="flex items-center gap-2">
              <span className="text-yellow-600">🏆</span> Best Sellers
            </span>
          } 
          viewAllLink="/products?sort=bestsellers" 
          queryKey={["products", "bestsellers"]} 
          queryParams={{ sort: "popular" }} 
          columns="4"
          limit={4}
        />
      </Suspense>
      
      <Suspense fallback={<LoadingSkeleton variant="product-card" count={4} className="py-12" />}>
        <ProductSection 
          title={
            <span className="flex items-center gap-2">
              <span className="text-red-500">❤️</span> Your Choice
            </span>
          } 
          viewAllLink="/products?sort=recommended" 
          queryKey={["products", "recommended"]} 
          queryParams={{ tags: "recommended" }} 
          columns="4"
          limit={4}
        />
      </Suspense>

      {/* Rectangular category cards grid */}
      <ShopByCategoryCards />
      
      {/* Creators & Become a Seller CTA */}
      <CreatorsAndSellerPromo />
      
      {/* "Kandyam is my go-to..." banner */}
      <CustomerReviewsBanner />
      
      {/* Newsletter and Download App */}
      <NewsletterAndApp />
    </>
  );
}
