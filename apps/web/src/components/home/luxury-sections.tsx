"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Star, Heart, ArrowRight, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api-client";
import { getImageUrl } from "@/lib/utils";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import type { Product } from "@/types";

export function FlashDeals() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 8);

    function updateTimer() {
      const now = new Date();
      const diff = endTime.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    }

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="bg-navy-500 py-16 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-500/10 -skew-x-12 transform origin-top" />
      <div className="absolute inset-0 pattern-dots opacity-5" />
      <div className="absolute top-10 left-10 w-64 h-64 bg-luxury-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
      <div className="container-page mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-white max-w-lg">
          <div className="inline-flex items-center gap-2 bg-primary-500/20 border border-primary-500/30 text-primary-300 text-xs font-bold px-4 py-2 rounded-full mb-4 uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" /> Limited Time Offer
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 leading-tight">
            Flash Deals <span className="text-primary-400">Up to 50% Off</span>
          </h2>
          <p className="text-navy-100 text-lg max-w-md leading-relaxed">
            Discover incredible savings on unique handcrafted pieces from our top sellers. Grab them before they're gone!
          </p>
        </div>
        
        <div className="flex items-center gap-3 md:gap-4 text-white">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-navy-600/80 border border-navy-400/50 flex items-center justify-center text-3xl md:text-4xl font-bold font-serif shadow-lg backdrop-blur-sm">{pad(timeLeft.hours)}</div>
            <span className="text-xs mt-2 text-navy-200 uppercase tracking-widest font-medium">Hours</span>
          </div>
          <span className="text-2xl font-serif font-bold text-primary-400 mt-[-20px]">:</span>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-navy-600/80 border border-navy-400/50 flex items-center justify-center text-3xl md:text-4xl font-bold font-serif shadow-lg backdrop-blur-sm">{pad(timeLeft.minutes)}</div>
            <span className="text-xs mt-2 text-navy-200 uppercase tracking-widest font-medium">Mins</span>
          </div>
          <span className="text-2xl font-serif font-bold text-primary-400 mt-[-20px]">:</span>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-navy-600/80 border border-navy-400/50 flex items-center justify-center text-3xl md:text-4xl font-bold font-serif shadow-lg backdrop-blur-sm">{pad(timeLeft.seconds)}</div>
            <span className="text-xs mt-2 text-navy-200 uppercase tracking-widest font-medium">Secs</span>
          </div>
        </div>

        <Link href="/deals" className="shrink-0 bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-primary hover:-translate-y-1 hover:shadow-lg">
          Shop Deals <ArrowRight className="inline ml-1 w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}

export function GiftFinder() {
  const recipients = [
    { label: "Partner", emoji: "💑" },
    { label: "Friend", emoji: "👯" },
    { label: "Mother", emoji: "👩‍👧" },
    { label: "Father", emoji: "👨‍👦" },
    { label: "Wedding", emoji: "💍" },
    { label: "Birthday", emoji: "🎂" },
    { label: "Corporate", emoji: "💼" },
    { label: "Teacher", emoji: "📚" },
  ];
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section className="py-20 bg-main">
      <div className="container-page mx-auto">
        <div className="bg-white rounded-3xl p-8 md:p-14 shadow-soft-xl border border-surface-200 flex flex-col lg:flex-row items-center justify-between gap-10 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-primary-500/5 rounded-full blur-3xl"></div>
          
          <div className="w-full lg:w-1/2 z-10">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy-900 mb-4 leading-tight">Find the perfect gift.</h2>
            <p className="text-lg text-text-500 mb-10 max-w-md leading-relaxed">Tell us who you're shopping for, and we'll show you curated items they'll absolutely love.</p>
            
            <div className="flex flex-col gap-5 max-w-lg">
              <label className="text-sm font-bold text-navy-900 uppercase tracking-wider">Who are you shopping for?</label>
              <div className="flex flex-wrap gap-3">
                {recipients.map((r) => (
                  <button
                    key={r.label}
                    onClick={() => setSelected(r.label === selected ? null : r.label)}
                    className={`px-5 py-3 rounded-full border font-medium transition-all duration-300 ${
                      selected === r.label
                        ? "border-primary-500 bg-primary-500 text-white shadow-primary scale-105"
                        : "border-surface-300 text-text-600 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50"
                    }`}
                  >
                    <span className="mr-1.5">{r.emoji}</span>{r.label}
                  </button>
                ))}
              </div>
            </div>
            
            <Link
              href={selected ? `/gifts?for=${selected.toLowerCase()}` : "/gifts"}
              className="mt-10 inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              {selected ? `Find gifts for ${selected}` : "Discover Gifts"} <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="w-full lg:w-1/2 flex justify-center z-10">
            <div className="relative w-full max-w-sm aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/20 via-accent-500/20 to-primary-500/20 rounded-full blur-2xl" />
              <div className="relative w-full h-full bg-surface-100 rounded-full border-[6px] border-white shadow-2xl overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop" alt="Luxury Gift Box" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-lg">
                <span className="text-2xl">🎁</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProductGrids() {
  const { data: newData, isLoading: newLoading } = useQuery({
    queryKey: ["products", "new-arrivals"],
    queryFn: async () => {
      const res = await get<{ data: Product[] }>("/products", { sort: "newest", limit: 8 } as any);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: bestData, isLoading: bestLoading } = useQuery({
    queryKey: ["products", "best-sellers"],
    queryFn: async () => {
      const res = await get<{ data: Product[] }>("/products", { sort: "salesCount", order: "desc", limit: 8 } as any);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const newProducts = newData || [];
  const bestProducts = bestData || [];

  const renderProductCard = (product: Product | any, showSold?: boolean) => {
    const primaryImage = product.images?.find((img: any) => img.isPrimary) || product.images?.[0];
    const imageUrl = getImageUrl(primaryImage?.medium || primaryImage?.url);
    const price = parseFloat(product.price || "0");
    const sold = product.salesCount || product.sold || 0;

    return (
      <div key={product.id} className="group relative flex flex-col bg-white rounded-2xl border border-surface-200 overflow-hidden hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1">
        <div className="relative aspect-square overflow-hidden bg-surface-100">
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <button className="absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-white/80 text-text-400 hover:text-primary-500 hover:bg-white backdrop-blur-sm transition-all shadow-sm z-10">
            <Heart className="h-4 w-4" />
          </button>
          {showSold && sold > 0 && (
            <div className="absolute top-3 left-3 bg-navy-900/80 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
              #{sold.toLocaleString()} Sold
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <span className="text-xs text-text-500 mb-1">{product.vendor?.storeName || product.maker || "Kandiyam Seller"}</span>
          <Link href={`/products/${product.slug || "#"}`} className="font-semibold text-navy-900 hover:text-primary-600 transition-colors line-clamp-1 mb-2">{product.title}</Link>
          <div className="flex items-center gap-1 mb-3">
            <Star className="w-3.5 h-3.5 fill-luxury-gold text-luxury-gold" />
            <span className="text-sm font-medium text-navy-900">{product.averageRating?.toFixed(1) || product.rating || "4.5"}</span>
            <span className="text-xs text-text-400">({product.reviewCount || product.reviews || 0})</span>
          </div>
          <div className="mt-auto flex items-center justify-between">
            <span className="font-bold text-lg text-navy-900">Rs. {price.toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-20 bg-white space-y-28">
      <div className="container-page mx-auto">
        <div className="flex flex-col items-center mb-10">
          <span className="text-xs font-bold text-primary-500 uppercase tracking-[0.2em] mb-2">Fresh From Sellers</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy-900">New Arrivals</h2>
          <div className="w-16 h-1 bg-primary-500 mt-4 rounded-full"></div>
        </div>
        {newLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <LoadingSkeleton key={i} variant="product-card" count={1} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newProducts.slice(0, 8).map((p) => renderProductCard(p))}
          </div>
        )}
        <div className="flex justify-center mt-10">
          <Link href="/products?sort=newest" className="btn-primary text-base px-8 py-3.5">
            View All New Arrivals <ArrowRight className="inline ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="container-page mx-auto">
        <div className="flex flex-col items-center mb-10">
          <span className="text-xs font-bold text-luxury-gold uppercase tracking-[0.2em] mb-2">Community Favorites</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy-900 flex items-center gap-2">Best Sellers <Star className="text-luxury-gold fill-luxury-gold w-7 h-7"/></h2>
          <div className="w-16 h-1 bg-luxury-gold mt-4 rounded-full"></div>
        </div>
        {bestLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <LoadingSkeleton key={i} variant="product-card" count={1} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bestProducts.slice(0, 8).map((p) => renderProductCard(p, true))}
          </div>
        )}
        <div className="flex justify-center mt-10">
          <Link href="/products?sort=best-selling" className="btn-secondary text-base px-8 py-3.5">
            View All Best Sellers <ArrowRight className="inline ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function ShopByRegion() {
  const regions = [
    { name: "Kandy", description: "Hill Country Crafts", img: "https://images.unsplash.com/photo-1620608552395-58079633e8dc?q=80&w=400&auto=format&fit=crop" },
    { name: "Galle", description: "Coastal Sellers", img: "https://images.unsplash.com/photo-1550184658-ff613b5e40e8?q=80&w=400&auto=format&fit=crop" },
    { name: "Jaffna", description: "Northern Treasures", img: "https://images.unsplash.com/photo-1625736301382-78d10d19e072?q=80&w=400&auto=format&fit=crop" },
    { name: "Matara", description: "Southern Heritage", img: "https://images.unsplash.com/photo-1588722881267-bc80f1ed7f0f?q=80&w=400&auto=format&fit=crop" },
    { name: "Anuradhapura", description: "Ancient Capital", img: "https://images.unsplash.com/photo-1626201314959-8669c585e49f?q=80&w=400&auto=format&fit=crop" },
    { name: "Kurunegala", description: "Central Plains", img: "https://images.unsplash.com/photo-1616086883262-e64e525164bc?q=80&w=400&auto=format&fit=crop" },
  ];

  return (
    <section className="py-20 bg-main">
      <div className="container-page mx-auto">
        <div className="flex flex-col items-center mb-12">
          <span className="text-xs font-bold text-primary-500 uppercase tracking-[0.2em] mb-2">Discover Local</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy-900 text-center">Shop by Region</h2>
          <p className="text-text-500 mt-2">Explore crafts from every corner of Sri Lanka</p>
          <div className="w-16 h-1 bg-primary-500 mt-4 rounded-full"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {regions.map((r) => (
            <Link key={r.name} href={`/region/${r.name.toLowerCase()}`} className="group relative rounded-2xl overflow-hidden aspect-[4/5] shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
              <img src={r.img} alt={r.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/30 to-transparent" />
              <div className="absolute inset-0 bg-primary-500/0 group-hover:bg-primary-500/10 transition-colors duration-500" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="font-serif text-xl font-bold block mb-1">{r.name}</span>
                <span className="text-xs text-navy-100/80 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex items-center gap-1">
                  {r.description} <ArrowRight className="w-3 h-3"/>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HeritageCollection() {
  const heritageItems = [
    { name: "Masks", img: "https://images.unsplash.com/photo-1599643477874-c11f7c8fccbd?q=80&w=400&auto=format&fit=crop" },
    { name: "Wood Carvings", img: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=400&auto=format&fit=crop" },
    { name: "Brass Crafts", img: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=400&auto=format&fit=crop" },
    { name: "Handloom", img: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=400&auto=format&fit=crop" },
    { name: "Batik", img: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=400&auto=format&fit=crop" },
    { name: "Lacquer Work", img: "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=400&auto=format&fit=crop" },
  ];

  return (
    <section className="py-24 bg-navy-500 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[url('https://images.unsplash.com/photo-1599643477874-c11f7c8fccbd?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-5 mix-blend-overlay"></div>
      <div className="absolute inset-0 pattern-dots opacity-[0.03]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
      <div className="container-page mx-auto relative z-10 flex flex-col items-center text-center">
        <span className="text-luxury-gold uppercase tracking-[0.3em] text-sm font-bold mb-4">Premium Selection</span>
        <h2 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">The Heritage<br/>Collection</h2>
        <p className="text-navy-100 max-w-2xl text-lg mb-12 leading-relaxed">Discover our most exquisite, historically significant crafts. Featuring masterfully carved wooden masks, intricate brasswork, and authentic handloom textiles passed down through generations.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 w-full mb-12">
          {heritageItems.map((item, idx) => (
            <div key={item.name} className="group relative rounded-xl overflow-hidden aspect-square border-2 border-luxury-gold/20 hover:border-luxury-gold/60 transition-all duration-500 cursor-pointer hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]">
              <img src={item.img} alt={item.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-navy-900/50 group-hover:bg-navy-900/30 transition-colors duration-500" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <span className="text-luxury-light font-serif text-lg md:text-xl font-bold group-hover:text-luxury-gold transition-colors duration-300">{item.name}</span>
                <span className="text-xs text-navy-200 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">Explore →</span>
              </div>
            </div>
          ))}
        </div>

        <Link href="/collections/heritage" className="bg-transparent border-2 border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-navy-900 px-10 py-4 rounded-full font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:-translate-y-0.5">
          View Collection <ArrowRight className="inline ml-2 w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

export function CustomerReviewsDark() {
  const reviews = [
    {
      id: 1,
      name: "Sarah Jenkins",
      location: "London, UK",
      item: "Heritage Mask",
      text: "The craftsmanship is absolutely stunning. I received my wooden mask perfectly packaged. Kandiyam connects you with true sellers! Every detail was hand-carved with such care.",
      avatar: "S",
      rating: 5,
    },
    {
      id: 2,
      name: "Raj Patel",
      location: "Sydney, AU",
      item: "Brass Oil Lamp",
      text: "Ordered this lamp for my mother's birthday and it exceeded expectations. The brasswork is museum quality. Shipping was fast and the seller even included a handwritten note.",
      avatar: "R",
      rating: 5,
    },
    {
      id: 3,
      name: "Maria Fernandez",
      location: "Barcelona, ES",
      item: "Batik Wall Art",
      text: "I've bought from many seller marketplaces but Kandiyam stands out. The batik piece I received is now the centerpiece of my living room. Incredible value for real craftsmanship.",
      avatar: "M",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-navy-500 text-white relative overflow-hidden">
      <div className="absolute inset-0 pattern-dots opacity-[0.03]" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-500/5 skew-x-12 transform origin-top" />
      <div className="container-page mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-luxury-gold uppercase tracking-[0.3em] mb-4 block">Testimonials</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">Loved by buyers worldwide</h2>
          <p className="text-navy-100 text-lg max-w-lg mx-auto mb-6">Join thousands of happy customers who discovered the beauty of Sri Lankan craftsmanship.</p>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-6 h-6 fill-luxury-gold text-luxury-gold" />)}
            <span className="ml-3 text-lg font-bold text-white">4.9/5</span>
            <span className="text-navy-200 text-sm">from 2,400+ reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white/[0.03] backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-luxury-gold/30 transition-all duration-300 hover:-translate-y-1">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-luxury-gold text-luxury-gold" />
                ))}
              </div>
              <p className="text-navy-100 mb-6 italic leading-relaxed">"{review.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center font-bold text-white text-lg shadow-lg shrink-0">
                  {review.avatar}
                </div>
                <div>
                  <div className="font-semibold text-white">{review.name}</div>
                  <div className="text-xs text-navy-200">{review.location} · Purchased {review.item}</div>
                </div>
                <div className="ml-auto">
                  <svg className="w-8 h-8 text-luxury-gold/30" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function NewsletterSimple() {
  return (
    <section className="py-24 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 relative overflow-hidden">
      <div className="absolute inset-0 pattern-dots opacity-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="container-page mx-auto text-center relative z-10">
        <span className="text-xs font-bold text-primary-200 uppercase tracking-[0.3em] mb-3 block">Stay Connected</span>
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">Get exclusive offers & early access</h2>
        <p className="text-primary-100 mb-10 max-w-lg mx-auto text-lg leading-relaxed">Subscribe to our newsletter for new collection drops, exclusive seller stories, and member-only discounts.</p>
        <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={e => e.preventDefault()}>
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 h-14 px-6 rounded-full bg-white text-navy-900 font-medium placeholder:text-text-400 focus:outline-none focus:ring-2 focus:ring-white shadow-inner text-base"
          />
          <button type="submit" className="h-14 bg-navy-900 text-white px-10 rounded-full font-bold hover:bg-navy-800 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-base">
            Subscribe
          </button>
        </form>
        <p className="text-primary-200 text-xs mt-4">No spam, ever. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}

export function MobileAppSection() {
  return (
    <section className="py-24 bg-main border-t border-surface-200">
      <div className="container-page mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="relative">
            <div className="relative w-72 h-[540px] bg-navy-900 rounded-[3rem] border-[6px] border-navy-800 shadow-2xl overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-7 bg-navy-800 rounded-b-3xl w-1/3 mx-auto z-10"></div>
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-white">
                <div className="text-5xl mb-4">🏺</div>
                <span className="font-serif font-bold text-2xl mb-2">Kandiyam</span>
                <span className="text-navy-200 text-sm text-center">Discover unique handcrafted treasures</span>
                <div className="mt-6 grid grid-cols-2 gap-3 w-full">
                  <div className="bg-navy-800 rounded-2xl p-3 aspect-square flex items-center justify-center">
                    <span className="text-2xl">🪵</span>
                  </div>
                  <div className="bg-navy-800 rounded-2xl p-3 aspect-square flex items-center justify-center">
                    <span className="text-2xl">💎</span>
                  </div>
                  <div className="bg-navy-800 rounded-2xl p-3 aspect-square flex items-center justify-center">
                    <span className="text-2xl">🖼️</span>
                  </div>
                  <div className="bg-navy-800 rounded-2xl p-3 aspect-square flex items-center justify-center">
                    <span className="text-2xl">👘</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg animate-float">
              ✨
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <span className="text-xs font-bold text-primary-500 uppercase tracking-[0.3em] mb-3 block">Mobile App</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy-900 mb-6 leading-tight">Shop crafts, anywhere.</h2>
          <p className="text-lg text-text-500 mb-10 max-w-md leading-relaxed">Browse handcrafted treasures on the go. Get instant notifications for flash deals, track your orders, and message sellers directly.</p>
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <button className="bg-navy-900 text-white px-6 py-4 rounded-2xl flex items-center gap-3 hover:bg-navy-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              <div className="text-left">
                <div className="text-[10px] uppercase tracking-wider opacity-80">Download on the</div>
                <div className="font-bold text-sm">App Store</div>
              </div>
            </button>
            <button className="bg-navy-900 text-white px-6 py-4 rounded-2xl flex items-center gap-3 hover:bg-navy-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 010 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z"/></svg>
              <div className="text-left">
                <div className="text-[10px] uppercase tracking-wider opacity-80">Get it on</div>
                <div className="font-bold text-sm">Google Play</div>
              </div>
            </button>
            <div className="hidden lg:block p-2 bg-white rounded-xl border border-surface-300 shadow-sm">
              <div className="w-20 h-20 bg-surface-100 rounded-lg flex items-center justify-center text-xs text-text-400 font-mono">
                <div className="grid grid-cols-7 gap-px">
                  {Array.from({ length: 49 }).map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 ${[1,0,1,1,0,0,1,0,1,0,0,1,1,1,0][i % 15] ? 'bg-navy-900' : 'bg-transparent'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
