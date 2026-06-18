"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/shared/badge";
import { PriceDisplay } from "@/components/shared/price-display";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api-client";
import { getImageUrl } from "@/lib/utils";

interface ApiVendor {
  id: string;
  storeName: string;
  storeSlug: string;
  storeDescription: string;
  storeLogo: string | null;
  craftType: string[];
  workshopCity: string | null;
  products?: ApiProduct[];
}

interface ApiProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  images: Array<{ url: string | null }>;
}

const fadeInSection = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function ArtisanSpotlight() {
  const { data, isLoading } = useQuery({
    queryKey: ["vendors", "spotlight"],
    queryFn: () => get<{ data: ApiVendor[] }>("/vendors", { limit: 2 }),
    staleTime: 5 * 60 * 1000,
  });

  const artisans = data?.data || [];

  if (isLoading || artisans.length === 0) return null;

  return (
    <section className="py-16 px-4 bg-surface-50 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-radial-gradient(circle at 25% 50%, #b0566e 0px, #b0566e 2px, transparent 2px, transparent 40px)",
        }}
      />

      <div className="max-w-8xl mx-auto relative">
        <h2 className="font-serif text-3xl text-text-900 text-center mb-12">
          Meet Our Sellers
        </h2>

        <div className="space-y-20">
          {artisans.map((artisan, index) => (
            <motion.div
              key={artisan.id}
              variants={fadeInSection}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
            >
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-gradient-to-br from-primary-100 to-accent-100">
                {artisan.storeLogo ? (
                  <Image
                    src={getImageUrl(artisan.storeLogo)}
                    alt={artisan.storeName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl font-serif text-primary-300">{artisan.storeName[0]}</span>
                  </div>
                )}
              </div>

              <div>
                <Badge variant="blush" size="sm" className="mb-3">
                  {artisan.craftType?.[0] || "Seller"}
                </Badge>
                <h3 className="font-serif text-2xl text-text-900 mb-1">
                  {artisan.storeName}
                </h3>
                {artisan.workshopCity && (
                  <p className="text-muted-600 text-sm mb-4">
                    {artisan.workshopCity} &middot; Sri Lanka
                  </p>
                )}

                <p className="text-muted-600 mb-8 line-clamp-4">
                  {artisan.storeDescription || `Discover authentic handcrafted products from ${artisan.storeName}. Each piece is made with traditional techniques passed down through generations.`}
                </p>

                <Link
                  href={`/makers/${artisan.storeSlug}`}
                  className="inline-flex items-center px-6 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  Visit Store
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
