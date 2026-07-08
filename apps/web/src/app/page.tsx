import { Suspense } from "react";
import { HeroSection } from "@/components/home/hero-section";
import { TrustBar } from "@/components/home/trust-bar";
import { DiscoveryRow } from "@/components/home/discovery-row";
import { CategoryIconRow } from "@/components/home/category-icon-row";
import { PromoBanners } from "@/components/home/promo-banners";
import { ProductGrids } from "@/components/home/product-grids";
import { ShopByCategory } from "@/components/home/shop-by-category";
import { MeetOurSellers } from "@/components/home/meet-our-sellers";
import { SocialProofTestimonial } from "@/components/home/social-proof-testimonial";
import { BottomCTA } from "@/components/home/bottom-cta";

export const metadata = {
  title: "Kandyam - A global marketplace for unique, creative and one-of-a-kind items",
  description: "Explore a curated selection of digital assets, software, templates, gift cards, and unique items from independent creators everywhere on Kandyam.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col w-full bg-[#FCFDFD]">
      {/* 1. Hero Section */}
      <HeroSection />
      
      {/* 2. Trust Bar */}
      <TrustBar />
      
      {/* 3. Discovery Row (Trending, Editors Picks, Recently Viewed) */}
      <DiscoveryRow />
      
      {/* 4. Category Icons */}
      <CategoryIconRow />
      
      {/* 5. Promo Banners */}
      <PromoBanners />
      
      {/* 6. Product Grids (New Arrivals, Best Sellers, Your Choice) */}
      <ProductGrids />
      
      {/* 7. Shop by Category (Bento box) */}
      <ShopByCategory />
      
      {/* 8. Meet Our Sellers */}
      <MeetOurSellers />
      
      {/* 9. Social Proof / Testimonials */}
      <SocialProofTestimonial />
      
      {/* 10. Bottom CTA (Newsletter & App) */}
      <BottomCTA />
    </div>
  );
}