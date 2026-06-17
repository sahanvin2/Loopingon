"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api-client";
import { getImageUrl } from "@/lib/utils";

interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  image: string | null;
}

const HERITAGE_SLUGS = ["wood-carving-masks", "batik-dyeing", "handloom-textiles", "brass-bell-metal", "jewelry-brassware", "lacquerware"];

export function SriLankanHeritage() {
  const { data } = useQuery({
    queryKey: ["categories", "heritage"],
    queryFn: () => get<{ data: ApiCategory[] }>("/categories", { limit: 20 }),
    staleTime: 5 * 60 * 1000,
  });

  const allCategories = data?.data || [];
  const collections = HERITAGE_SLUGS
    .map((slug) => allCategories.find((c) => c.slug === slug))
    .filter(Boolean) as ApiCategory[];

  if (collections.length === 0) return null;

  return (
    <section className="py-12 px-4 max-w-8xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-2xl md:text-3xl text-text-900 font-medium">
          Sri Lankan Heritage Collection
        </h2>
        <Link href="/categories" className="hidden sm:flex items-center text-sm font-medium text-accent-600 hover:text-accent-700 transition-colors">
          View all categories <ArrowRight className="ml-1 w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        {collections.map((item, index) => (
          <motion.div
            key={item.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Link href={`/categories/${item.slug}`} className="block group">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm mb-3 border border-surface-300 bg-surface-200">
                {item.image ? (
                  <Image
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-100 to-accent-100" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              </div>
              <h3 className="font-serif text-center text-text-900 text-sm sm:text-base group-hover:text-primary-600 transition-colors">
                {item.name}
              </h3>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
