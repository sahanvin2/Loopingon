"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api-client";
import type { Product, PaginatedResponse } from "@/types";
import { ProductGrid } from "@/components/product/product-grid";
import { Pagination } from "@/components/shared/pagination";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomSelect } from "@/components/shared/custom-select";

const ALL_CATEGORIES = [
  { label: "All Categories", slug: "" },
  { label: "Electronics", slug: "electronics-accessories" },
  { label: "Home & Living", slug: "home-living" },
  { label: "Kids & Baby", slug: "kids-baby" },
  { label: "Bath & Beauty", slug: "bath-beauty" },
  { label: "Accessories", slug: "accessories" },
  { label: "Jewelry", slug: "jewelry" },
  { label: "Craft Supplies", slug: "craft-supplies-tools" },
  { label: "Bags & Purses", slug: "bags-purses" },
  { label: "Books & Music", slug: "books-movies-music" },
  { label: "Clothing", slug: "clothing" },
  { label: "Toys & Games", slug: "toys-games" },
  { label: "Paper & Party", slug: "paper-party-supplies" },
  { label: "Art & Collectibles", slug: "art-collectibles" },
  { label: "Pet Supplies", slug: "pet-supplies" },
  { label: "Shoes", slug: "shoes" },
  { label: "Gifts", slug: "gifts" },
  { label: "Weddings", slug: "weddings" },
];

const PRICE_RANGES = [
  { label: "All Prices", min: "", max: "" },
  { label: "Under Rs. 500", min: "0", max: "500" },
  { label: "Rs. 500 - 1,000", min: "500", max: "1000" },
  { label: "Rs. 1,000 - 2,500", min: "1000", max: "2500" },
  { label: "Rs. 2,500 - 5,000", min: "2500", max: "5000" },
  { label: "Rs. 5,000+", min: "5000", max: "" },
];

const RATINGS = [
  { label: "Any Rating", value: "" },
  { label: "★★★★ & up", value: "4" },
  { label: "★★★ & up", value: "3" },
  { label: "★★ & up", value: "2" },
];

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Best Rating", value: "rating" },
  { label: "Most Popular", value: "popular" },
];

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const activeCategory = searchParams.get("category") || "";
  const activeSort = searchParams.get("sort") || "newest";
  const query = searchParams.get("q") || "";
  const activeMinPrice = searchParams.get("minPrice") || "";
  const activeMaxPrice = searchParams.get("maxPrice") || "";
  const activeRating = searchParams.get("rating") || "";
  const activeOnSale = searchParams.get("onSale") === "1";
  const activeHandmade = searchParams.get("isHandmade") === "1";

  const [searchInput, setSearchInput] = useState(query);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const buildQueryParams = (): Record<string, unknown> => {
    const p: Record<string, unknown> = { page, limit: 24 };
    if (query) p.search = query;
    if (activeCategory) p.category = activeCategory;
    if (activeSort && activeSort !== "newest") p.sortBy = activeSort;
    if (activeMinPrice) p.priceMin = parseFloat(activeMinPrice);
    if (activeMaxPrice) p.priceMax = parseFloat(activeMaxPrice);
    if (activeRating) p.rating = parseFloat(activeRating);
    if (activeOnSale) p.onSale = true;
    if (activeHandmade) p.isHandmade = true;
    return p;
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["products", page, activeSort, activeCategory, query, activeMinPrice, activeMaxPrice, activeRating, activeOnSale, activeHandmade],
    queryFn: async () => {
      const res = await get<PaginatedResponse<Product>>("/products", buildQueryParams() as any);
      return res;
    },
    staleTime: 30 * 1000,
  });

  const products = data?.data || [];
  const total = data?.meta?.total || 0;
  const totalPages = data?.meta?.totalPages || 1;

  const navigate = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v && v !== "newest") params.set(k, v);
      else params.delete(k);
    });
    if (!updates.page) params.set("page", "1");
    router.push(`/products?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ q: searchInput.trim() });
  };

  const clearAll = () => {
    router.push("/products");
    setSearchInput("");
  };

  const hasAnyFilter = activeCategory || activeMinPrice || activeMaxPrice || activeRating || activeOnSale || activeHandmade || query;

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Clear All */}
      {hasAnyFilter && (
        <button onClick={clearAll} className="text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline">
          ✕ Clear all filters
        </button>
      )}

      {/* Category */}
      <div>
        <h4 className="text-[11px] font-bold text-text-500 uppercase tracking-[0.15em] mb-3">Category</h4>
        <div className="space-y-0.5 max-h-[280px] overflow-y-auto scrollbar-thin">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => navigate({ category: cat.slug })}
              className={cn(
                "block w-full text-left px-2.5 py-1.5 rounded-lg text-sm transition-colors",
                activeCategory === cat.slug && !cat.slug
                  ? "bg-primary-50 text-primary-600 font-semibold"
                  : activeCategory === cat.slug
                    ? "bg-primary-50 text-primary-600 font-semibold"
                    : "text-text-600 hover:bg-surface-50 hover:text-text-800",
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-[11px] font-bold text-text-500 uppercase tracking-[0.15em] mb-3">Price Range</h4>
        <div className="space-y-0.5">
          {PRICE_RANGES.map((pr) => (
            <button
              key={pr.label}
              onClick={() => navigate({ minPrice: pr.min, maxPrice: pr.max })}
              className={cn(
                "block w-full text-left px-2.5 py-1.5 rounded-lg text-sm transition-colors",
                activeMinPrice === pr.min && activeMaxPrice === pr.max
                  ? "bg-primary-50 text-primary-600 font-semibold"
                  : "text-text-600 hover:bg-surface-50 hover:text-text-800",
              )}
            >
              {pr.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <input
            type="number"
            placeholder="Min"
            value={activeMinPrice}
            onChange={(e) => navigate({ minPrice: e.target.value })}
            className="w-full h-8 px-2 rounded-lg border border-surface-300 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <span className="text-muted-400 self-center text-xs">-</span>
          <input
            type="number"
            placeholder="Max"
            value={activeMaxPrice}
            onChange={(e) => navigate({ maxPrice: e.target.value })}
            className="w-full h-8 px-2 rounded-lg border border-surface-300 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="text-[11px] font-bold text-text-500 uppercase tracking-[0.15em] mb-3">Customer Rating</h4>
        <div className="space-y-0.5">
          {RATINGS.map((r) => (
            <button
              key={r.value}
              onClick={() => navigate({ rating: r.value })}
              className={cn(
                "block w-full text-left px-2.5 py-1.5 rounded-lg text-sm transition-colors",
                activeRating === r.value
                  ? "bg-primary-50 text-primary-600 font-semibold"
                  : "text-text-600 hover:bg-surface-50 hover:text-text-800",
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Attributes */}
      <div>
        <h4 className="text-[11px] font-bold text-text-500 uppercase tracking-[0.15em] mb-3">More Filters</h4>
        <div className="space-y-2.5">
          <label className="flex items-center gap-2 text-sm text-text-600 cursor-pointer hover:text-text-800">
            <input
              type="checkbox"
              checked={activeOnSale}
              onChange={(e) => navigate({ onSale: e.target.checked ? "1" : "" })}
              className="rounded border-surface-300 text-primary-600 focus:ring-primary-500"
            />
            On Sale
          </label>
          <label className="flex items-center gap-2 text-sm text-text-600 cursor-pointer hover:text-text-800">
            <input
              type="checkbox"
              checked={activeHandmade}
              onChange={(e) => navigate({ isHandmade: e.target.checked ? "1" : "" })}
              className="rounded border-surface-300 text-primary-600 focus:ring-primary-500"
            />
            premium Only
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-surface-50 min-h-screen">
      <div className="mx-auto max-w-8xl px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-serif text-3xl font-bold text-navy-900">
            {activeCategory
              ? ALL_CATEGORIES.find(c => c.slug === activeCategory)?.label || "Products"
              : query ? `Search: "${query}"` : "All Products"}
          </h1>
          <p className="mt-1 text-muted-500 text-sm">
            {isLoading ? "Loading..." : `${total.toLocaleString()} products found`}
            {hasAnyFilter && !isLoading && (
              <button onClick={clearAll} className="ml-3 text-primary-600 hover:underline text-xs font-medium">
                Clear filters
              </button>
            )}
          </p>
        </div>

        {/* Search + Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products..."
              className="w-full h-11 pl-10 pr-10 rounded-xl border border-surface-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {query && (
              <button type="button" onClick={() => { setSearchInput(""); navigate({ q: "" }); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-400 hover:text-text-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </form>
          <div className="flex gap-2">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 h-11 rounded-xl border border-surface-300 bg-white text-sm font-medium text-text-600 hover:bg-surface-50"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasAnyFilter && <span className="w-2 h-2 rounded-full bg-primary-500 ml-0.5" />}
            </button>
            <CustomSelect
              value={activeSort}
              onChange={(val: string) => navigate({ sort: val })}
              options={SORT_OPTIONS}
              wrapperClassName="w-48"
              className="h-11 border-surface-300 font-medium text-text-600"
            />
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-[220px] shrink-0">
            <div className="sticky top-28 bg-white rounded-2xl border border-surface-200 shadow-sm p-5">
              <FilterSidebar />
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          {mobileFiltersOpen && (
            <div className="lg:hidden fixed inset-0 z-50" onClick={() => setMobileFiltersOpen(false)}>
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
              <div className="absolute left-0 top-0 bottom-0 w-[300px] bg-white shadow-2xl rounded-r-2xl p-5 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-serif text-lg font-bold text-navy-900">Filters</h3>
                  <button onClick={() => setMobileFiltersOpen(false)} className="p-1 rounded-lg hover:bg-surface-100">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterSidebar />
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="mt-6 w-full py-3 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors"
                >
                  Show Results
                </button>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => <LoadingSkeleton key={i} variant="product-card" count={1} />)}
              </div>
            ) : isError ? (
              <div className="py-20 text-center">
                <p className="text-lg text-muted-500">Failed to load products.</p>
                <button onClick={() => refetch()} className="mt-4 text-primary-600 hover:underline font-medium">Try again</button>
              </div>
            ) : products.length > 0 ? (
              <>
                <ProductGrid products={products} />
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <Pagination currentPage={page} totalPages={totalPages} baseUrl="/products" />
                  </div>
                )}
              </>
            ) : (
              <div className="py-20 text-center">
                <p className="text-lg text-muted-500">No products found matching your criteria.</p>
                <button onClick={clearAll} className="mt-3 text-sm text-primary-600 hover:underline font-medium">
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
