"use client";

import React from "react";
import { motion } from "framer-motion";
import { Map, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const regions = [
  { name: "Kandy", craft: "Brassware & Batik", slug: "kandy" },
  { name: "Galle", craft: "Lace & Wood Carving", slug: "galle" },
  { name: "Jaffna", craft: "Palmyra Products", slug: "jaffna" },
  { name: "Matara", craft: "Beeralu Lace", slug: "matara" },
];

export default function RegionsPage() {
  return (
    <main className="min-h-screen bg-surface-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mx-auto w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-6"
          >
            <Map className="w-10 h-10 text-primary-500" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-navy-900 mb-6">
            Explore by Region
          </h1>
          <p className="text-lg text-text-600 leading-relaxed">
            Sri Lanka is a tapestry of unique local traditions. Discover the signature crafts from different regions across the island.
          </p>
        </div>

        {/* Regions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {regions.map((region, index) => (
            <motion.div
              key={region.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/products?region=${region.slug}`}
                className="group block relative h-[400px] rounded-2xl overflow-hidden shadow-soft transition-all hover:-translate-y-1 hover:shadow-soft-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/30 to-transparent z-10" />
                <div className="absolute inset-0 bg-navy-900/10 group-hover:bg-transparent transition-colors z-10" />
                
                {/* Fallback pattern since real images are removed */}
                <div className="w-full h-full bg-gradient-brand flex items-center justify-center opacity-80 group-hover:scale-105 transition-transform duration-700">
                  <MapPin className="w-20 h-20 text-white/30" />
                </div>
                
                <div className="absolute bottom-6 left-6 right-6 z-20">
                  <h3 className="text-2xl font-serif font-bold text-white mb-2">{region.name}</h3>
                  <p className="text-white/80 text-sm mb-4">{region.craft}</p>
                  <div className="flex items-center gap-2 text-primary-300 text-sm font-medium opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                    Explore Region <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
